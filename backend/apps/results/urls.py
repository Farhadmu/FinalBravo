from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResultViewSet, AnalyticsViewSet

router = DefaultRouter()
router.register(r'results', ResultViewSet)
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
]
