import json
from django.conf import settings
from rest_framework import serializers
from .models import Question, QuestionImage

class QuestionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImage
        fields = ['id', 'image', 'caption', 'order']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.image:
            url = ret['image']
            if url and '/media/questions/' in url and 'supabase.co' not in url:
                if getattr(settings, 'AWS_S3_CUSTOM_DOMAIN', None):
                    relative_path = url.split('/media/')[-1]
                    ret['image'] = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{relative_path}"
                elif self.context.get('request') and url.startswith('/'):
                    ret['image'] = self.context['request'].build_absolute_uri(url)
        return ret

class TestQuestionSerializer(serializers.ModelSerializer):
    """Minimal serializer for test-taking - excludes test field to reduce payload size"""
    images = QuestionImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'options', 'order', 'images']

class QuestionSerializer(serializers.ModelSerializer):
    images = QuestionImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'test', 'question_text', 'question_type', 'options', 'difficulty_level', 'images']

class AdminQuestionSerializer(serializers.ModelSerializer):
    images = QuestionImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(write_only=True, required=False, allow_null=True)
    options = serializers.JSONField(required=False, allow_null=True)
    correct_answer = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Question
        fields = '__all__'

    def validate(self, attrs):
        question_type = attrs.get('question_type')
        correct_answer = attrs.get('correct_answer')

        if question_type in ['mcq', 'true_false'] and not correct_answer:
            raise serializers.ValidationError({'correct_answer': 'This field may not be blank.'})

        if question_type == 'wat' and correct_answer is None:
            attrs['correct_answer'] = ''

        return attrs

    def to_internal_value(self, data):
        # Make a mutable copy if it's a QueryDict (multipart/form-data)
        if hasattr(data, 'copy'):
            data = data.copy()
        else:
            data = dict(data)

        # Handle options field - parse JSON string if needed
        if 'options' in data:
            options_value = data.get('options')

            if isinstance(options_value, str) and options_value.strip():
                try:
                    parsed = json.loads(options_value)
                    if isinstance(parsed, list):
                        data['options'] = parsed
                    elif isinstance(parsed, dict):
                        data['options'] = [parsed]
                    else:
                        data['options'] = []
                except (json.JSONDecodeError, ValueError):
                    data['options'] = []
            elif isinstance(options_value, list):
                # Already a list (JSON request), keep as is
                data['options'] = options_value

        return super().to_internal_value(data)

    def validate_options(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("Options must be a list")
        for option in value:
            if not isinstance(option, dict):
                raise serializers.ValidationError("Each option must be an object")
            if 'id' not in option or 'text' not in option:
                raise serializers.ValidationError("Each option must have 'id' and 'text' fields")
        return value

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        question = Question.objects.create(**validated_data)
        if image:
            QuestionImage.objects.create(question=question, image=image)
        return question

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        question = super().update(instance, validated_data)
        if image is not None:
            question.images.all().delete()
            QuestionImage.objects.create(question=question, image=image)
        return question