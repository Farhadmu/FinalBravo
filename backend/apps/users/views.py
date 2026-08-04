"""
Views for user authentication and management.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from django.db.models import Sum, Count, Avg, Max, Q, Value, DecimalField
from django.db.models.functions import TruncDate, Coalesce
from datetime import timedelta, date
from .serializers import (
    UserSerializer, 
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    UserCreateSerializer
)
from apps.tests.models import Test
from apps.results.models import Result

User = get_user_model()
import logging
logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                access_token = response.data.get('access')
                refresh_token = response.data.get('refresh')
                
                if access_token:
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                        value=access_token,
                        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                    )
                
                if refresh_token:
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                        value=refresh_token,
                        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                    )
            return response
        except Exception as e:
            username = request.data.get('username')
            logger.warning(f"Login failed for user '{username}': {str(e)}")
            return Response({
                'error': 'Authentication Failed',
                'detail': 'Invalid username or password. Please try again.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        
        if refresh_token:
            data = request.data.copy()
            data['refresh'] = refresh_token
            serializer = self.get_serializer(data=data)
        else:
            serializer = self.get_serializer(data=request.data)
            
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
            
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            if access_token:
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=access_token,
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                )
            
            if refresh_token:
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                    value=refresh_token,
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                )
                
        return response


class LogoutView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data.get('refresh_token') or request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['payment_status', 'role', 'is_active']
    search_fields = ['username', 'full_name', 'phone']
    ordering_fields = ['created_at', 'amount_paid', 'username']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'destroy', 'list']:
            permission_classes = [IsAdminUser]
        elif self.action in ['update', 'partial_update', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, 'is_developer', False):
            return User.objects.all()
        if user.role == 'admin':
            return User.objects.exclude(role='developer').exclude(is_developer=True).exclude(is_superuser=True)
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'detail': f'Password for {user.username} has been reset successfully.'})

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete: preserve payment history, just deactivate the user.
        Student data (results, payments) will remain.
        """
        user = self.get_object()
        # Keep payment records by just deactivating
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response({'detail': f'Student {user.username} deactivated. Payment history preserved.'}, status=status.HTTP_200_OK)


class AdminDashboardViewSet(viewsets.ViewSet):
    """ViewSet for admin dashboard statistics."""
    permission_classes = [IsAdminUser]

    def list(self, request):
        """Get aggregated dashboard statistics including payment tracking."""

        # Basic stats
        total_students = User.objects.filter(role='student').count()
        total_tests = Test.objects.count()

        # Payment stats
        paid_students = User.objects.filter(role='student', payment_status='paid').count()
        pending_payments = User.objects.filter(role='student', payment_status='pending').count()
        free_students = User.objects.filter(role='student', payment_status='free').count()

        # Total revenue (sum of amount_paid)
        total_revenue_result = User.objects.filter(
            role='student', payment_status='paid'
        ).aggregate(total=Sum('amount_paid'))
        total_revenue = float(total_revenue_result['total'] or 0)

        # This month enrollments
        today = timezone.now()
        first_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_enrollments = User.objects.filter(
            role='student',
            created_at__gte=first_of_month
        ).count()

        # Registration Stats (Last 7 days)
        last_7_days = today - timedelta(days=7)
        registrations = User.objects.filter(
            role='student',
            created_at__gte=last_7_days
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        registration_data = []
        for i in range(7):
            d = (today - timedelta(days=6 - i)).date()
            count = next((item['count'] for item in registrations if item['date'] == d), 0)
            registration_data.append({
                'date': d.strftime('%a'),
                'count': count,
            })

        # Pending students list
        pending_students_qs = User.objects.filter(
            role='student', payment_status='pending'
        ).values(
            'id', 'username', 'full_name', 'phone', 'email',
            'payment_note', 'created_at', 'enrollment_date'
        ).order_by('-created_at')[:10]

        pending_students = []
        for s in pending_students_qs:
            pending_students.append({
                'id': str(s['id']),
                'username': s['username'],
                'full_name': s['full_name'],
                'phone': s['phone'],
                'email': s['email'],
                'payment_note': s['payment_note'],
                'enrollment_date': str(s['enrollment_date']) if s['enrollment_date'] else None,
                'created_at': str(s['created_at']),
            })

        # Recent paid students (revenue list)
        recent_payments_qs = User.objects.filter(
            role='student', payment_status='paid'
        ).values(
            'id', 'username', 'full_name', 'amount_paid', 'enrollment_date'
        ).order_by('-enrollment_date', '-created_at')[:10]

        recent_payments = []
        for p in recent_payments_qs:
            recent_payments.append({
                'id': str(p['id']),
                'username': p['username'],
                'full_name': p['full_name'],
                'amount_paid': float(p['amount_paid'] or 0),
                'enrollment_date': str(p['enrollment_date']) if p['enrollment_date'] else None,
            })

        # Active students (last 7 days login)
        active_students = User.objects.filter(
            role='student',
            last_login__gte=last_7_days
        ).count()

        # Top performers
        top_performers_qs = Result.objects.filter(
            user__role='student'
        ).values('user__username', 'user__full_name').annotate(
            average_score=Avg('score_percentage'),
            tests_taken=Count('id'),
            highest_score=Max('score_percentage')
        ).order_by('-average_score')[:5]

        top_performers = [
            {
                'username': item['user__username'],
                'full_name': item['user__full_name'],
                'average_score': float(item['average_score'] or 0),
                'tests_taken': item['tests_taken'],
                'highest_score': float(item['highest_score'] or 0),
            }
            for item in top_performers_qs
        ]

        # Revenue data last 30 days
        revenue_start = today - timedelta(days=29)
        revenue_queryset = User.objects.filter(
            role='student',
            payment_status='paid',
            enrollment_date__gte=revenue_start.date()
        ).annotate(date=TruncDate('enrollment_date')).values('date').annotate(
            amount=Coalesce(Sum('amount_paid'), Value(0), output_field=DecimalField())
        ).order_by('date')

        revenue_data = []
        for i in range(30):
            d = (revenue_start + timedelta(days=i)).date()
            amount = next((item['amount'] for item in revenue_queryset if item['date'] == d), 0)
            revenue_data.append({
                'date': d.strftime('%b %d'),
                'amount': float(amount),
            })

        # Test stats
        # Build test statistics: compute pass rate in Python to avoid mixed-type
        # expression issues at the DB level.
        test_stats_qs = Result.objects.values('test__name').annotate(
            total_attempts=Count('id'),
            pass_count=Count('id', filter=Q(passed=True)),
            avg_score=Avg('score_percentage')
        ).order_by('-total_attempts')

        test_stats = []
        for item in test_stats_qs:
            total = int(item.get('total_attempts') or 0)
            pass_count = int(item.get('pass_count') or 0)
            pass_rate = (float(pass_count) / float(total) * 100.0) if total > 0 else 0.0
            test_stats.append({
                'test_name': item.get('test__name'),
                'total_attempts': total,
                'pass_rate': pass_rate,
                'avg_score': float(item.get('avg_score') or 0),
            })

        return Response({
            'stats': {
                'total_students': total_students,
                'total_tests': total_tests,
                'pending_payments': pending_payments,
                'paid_students': paid_students,
                'free_students': free_students,
                'total_revenue': total_revenue,
                'this_month_enrollments': this_month_enrollments,
                'active_students': active_students,
            },
            'registration_data': registration_data,
            'revenue_data': revenue_data,
            'recent_payments': recent_payments,
            'pending_students': pending_students,
            'top_performers': top_performers,
            'test_stats': test_stats,
        })