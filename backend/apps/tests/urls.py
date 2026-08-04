"""URL patterns for tests app."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, TestSessionViewSet

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'test-sessions', TestSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
