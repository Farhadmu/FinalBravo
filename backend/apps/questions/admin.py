"""
Admin configuration for Questions app.
"""
from django.contrib import admin
from .models import Question, QuestionImage


class QuestionImageInline(admin.TabularInline):
    """Inline admin for question images."""
    model = QuestionImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """Admin for Question model."""
    
    list_display = ('get_question_preview', 'test', 'question_type', 'difficulty_level', 'order', 'created_at')
    list_filter = ('test', 'question_type', 'difficulty_level')
    search_fields = ('question_text',)
    ordering = ('test', 'order', 'created_at')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [QuestionImageInline]
    
    fieldsets = (
        (None, {'fields': ('test', 'question_text', 'question_type')}),
        ('Options & Answer', {'fields': ('options', 'correct_answer')}),
        ('Additional Info', {'fields': ('difficulty_level', 'order', 'explanation')}),
        ('Metadata', {'fields': ('id', 'created_at', 'updated_at')}),
    )
    
    def get_question_preview(self, obj):
        """Get a preview of the question text."""
        return obj.question_text[:75] + '...' if len(obj.question_text) > 75 else obj.question_text
    get_question_preview.short_description = 'Question'


@admin.register(QuestionImage)
class QuestionImageAdmin(admin.ModelAdmin):
    """Admin for QuestionImage model."""
    
    list_display = ('question', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('question__question_text', 'caption')
    ordering = ('question', 'order')
