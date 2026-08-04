"""
Admin configuration for Tests app.
"""
from django.contrib import admin
from .models import Test, TestSession


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    """Admin for Test model."""
    
    list_display = ('name', 'duration_minutes', 'total_questions', 'price', 'is_free_sample', 'is_active', 'created_at')
    list_filter = ('is_free_sample', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('name', 'description')}),
        ('Configuration', {'fields': ('duration_minutes', 'total_questions', 'price', 'passing_score')}),
        ('Settings', {'fields': ('is_free_sample', 'is_active')}),
        ('Metadata', {'fields': ('id', 'created_by', 'created_at', 'updated_at')}),
    )


@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    """Admin for TestSession model."""
    
    list_display = ('user', 'test', 'status', 'score', 'percentage', 'started_at', 'submitted_at')
    list_filter = ('status', 'passed', 'started_at')
    search_fields = ('user__username', 'test__name')
    ordering = ('-started_at',)
    readonly_fields = ('id', 'started_at', 'submitted_at')
    
    fieldsets = (
        (None, {'fields': ('user', 'test', 'status')}),
        ('Timing', {'fields': ('started_at', 'submitted_at', 'time_limit_seconds', 'time_spent_seconds')}),
        ('Results', {'fields': ('score', 'percentage', 'passed')}),
        ('Device Info', {'fields': ('device_fingerprint', 'ip_address')}),
        ('Answers', {'fields': ('answers',)}),
    )
