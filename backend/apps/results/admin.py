"""
Admin configuration for Results app.
"""
from django.contrib import admin
from .models import Result, PerformanceAnalytics


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    """Admin for Result model."""
    
    list_display = ('user', 'test', 'score_percentage', 'passed', 'correct_answers', 'total_questions', 'created_at')
    list_filter = ('passed', 'test', 'created_at')
    search_fields = ('user__username', 'test__name')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        (None, {'fields': ('user', 'test', 'test_session')}),
        ('Scores', {'fields': ('total_questions', 'correct_answers', 'wrong_answers', 'unanswered', 'score_percentage', 'passed')}),
        ('Timing', {'fields': ('time_limit_seconds', 'time_taken_seconds')}),
        ('Rankings', {'fields': ('rank', 'percentile')}),
        ('Metadata', {'fields': ('id', 'created_at')}),
    )


@admin.register(PerformanceAnalytics)
class PerformanceAnalyticsAdmin(admin.ModelAdmin):
    """Admin for PerformanceAnalytics model."""
    
    list_display = ('user', 'total_tests_taken', 'total_tests_passed', 'average_score', 'highest_score', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('user__username',)
    ordering = ('-total_tests_taken',)
    readonly_fields = ('id', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('user',)}),
        ('Overall Stats', {'fields': ('total_tests_taken', 'total_tests_passed', 'average_score', 'highest_score', 'lowest_score')}),
        ('Time Stats', {'fields': ('average_time_taken', 'total_time_spent')}),
        ('Difficulty Breakdown', {'fields': ('easy_correct', 'easy_total', 'medium_correct', 'medium_total', 'hard_correct', 'hard_total')}),
        ('Metadata', {'fields': ('id', 'updated_at')}),
    )
