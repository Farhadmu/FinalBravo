from django.core.management.base import BaseCommand
from apps.results.models import PerformanceAnalytics
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Recalculates performance analytics for all users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Recalculate analytics for a specific user',
        )

    def handle(self, *args, **kwargs):
        username = kwargs.get('username')
        
        if username:
            # Recalculate for specific user
            try:
                user = User.objects.get(username=username)
                analytics, created = PerformanceAnalytics.objects.get_or_create(user=user)
                analytics.recalculate_from_results()
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully recalculated analytics for {username}')
                )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User {username} not found')
                )
        else:
            # Recalculate for all users
            self.stdout.write("Starting analytics recalculation for all users...")
            users_with_results = User.objects.filter(results__isnull=False).distinct()
            count = 0
            
            for user in users_with_results:
                analytics, created = PerformanceAnalytics.objects.get_or_create(user=user)
                analytics.recalculate_from_results()
                count += 1
                self.stdout.write(f'Processed {user.username}')
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully recalculated analytics for {count} users')
            )
