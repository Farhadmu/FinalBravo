"""URL patterns for questions app."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet

router = DefaultRouter()
# Register under 'questions' to match frontend API calls like
# /api/questions/questions/ (frontend uses the pattern <app>/<resource>/)
router.register(r'questions', QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
