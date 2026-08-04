from rest_framework import viewsets, permissions
from .models import Batch
from .serializers import BatchSerializer

class BatchViewSet(viewsets.ModelViewSet):
    serializer_class = BatchSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.is_staff or getattr(user, 'role', '') in ['admin', 'developer']):
            return Batch.objects.all()
        return Batch.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]