from django.db.models import Avg
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Result, PerformanceAnalytics
from .serializers import (
    ResultSerializer,
    ResultDetailSerializer,
    PerformanceAnalyticsSerializer,
    ResultSummarySerializer,
)

class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ResultDetailSerializer
        return ResultSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Result.objects.select_related('test', 'test_session')

        if user.is_superuser or getattr(user, 'is_developer', False) or user.role == 'admin':
            target_user = self.request.query_params.get('user')
            if target_user:
                return queryset.filter(user__id=target_user)
            return queryset

        return queryset.filter(user=user)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        try:
            # Try by primary key first
            return queryset.get(pk=lookup_value)
        except (Result.DoesNotExist, ValueError):
            # If not found or invalid UUID for PK, try as session ID
            try:
                return queryset.get(test_session_id=lookup_value)
            except (Result.DoesNotExist, ValueError):
                from django.http import Http404
                raise Http404


class AnalyticsViewSet(viewsets.ViewSet):
    """
    ViewSet for user analytics.
    Returns a single analytics object for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """
        Return the analytics for the current user.
        Auto-creates analytics if it doesn't exist and recalculates from results.
        """
        analytics, created = PerformanceAnalytics.objects.get_or_create(user=request.user)
        if created:
            analytics.recalculate_from_results()

        results_qs = Result.objects.filter(user=request.user).select_related('test').order_by('created_at')
        total_results = results_qs.count()
        passed_count = results_qs.filter(passed=True).count()
        pass_rate = round((passed_count / total_results) * 100, 1) if total_results else 0.0

        verbal_results = results_qs.filter(test__category='verbal')
        non_verbal_results = results_qs.filter(test__category='non-verbal')
        wat_results = results_qs.filter(test__category='wat')

        category_breakdown = {
            'verbal': {
                'avg_score': round(float(verbal_results.aggregate(avg=Avg('score_percentage'))['avg'] or 0.0), 1),
                'count': verbal_results.count(),
            },
            'non_verbal': {
                'avg_score': round(float(non_verbal_results.aggregate(avg=Avg('score_percentage'))['avg'] or 0.0), 1),
                'count': non_verbal_results.count(),
            },
            'wat': {
                'count': wat_results.count(),
            },
        }

        score_trend_qs = list(results_qs.order_by('-created_at')[:10])[::-1]
        score_trend = [
            {
                'test_number': index + 1,
                'score_percentage': float(item.score_percentage),
                'passed': item.passed,
            }
            for index, item in enumerate(score_trend_qs)
        ]

        improvement = 0.0
        if total_results >= 2:
            first_score = float(results_qs.first().score_percentage)
            latest_score = float(results_qs.last().score_percentage)
            if first_score != 0:
                improvement = round(((latest_score - first_score) / first_score) * 100, 1)

        recent_results = ResultSummarySerializer(
            results_qs.order_by('-created_at')[:5],
            many=True,
        ).data

        response_data = PerformanceAnalyticsSerializer(analytics).data
        response_data.update({
            'pass_rate': pass_rate,
            'improvement': improvement,
            'category_breakdown': category_breakdown,
            'recent_results': recent_results,
            'score_trend': score_trend,
            'wat_completion_rate': round((wat_results.count() / total_results) * 100, 1) if total_results else 0.0,
        })
        return Response(response_data)
