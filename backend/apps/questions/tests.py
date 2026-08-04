import json

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from apps.questions.models import Question, QuestionImage
from apps.tests.models import Test


class QuestionImageUploadTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.test = Test.objects.create(name='Sample Verbal Test', category='verbal')

    def test_create_question_with_image_upload(self):
        image = SimpleUploadedFile(
            'sample.png',
            b'fake-image-bytes',
            content_type='image/png',
        )

        response = self.client.post(
            '/api/questions/questions/',
            {
                'test': str(self.test.id),
                'question_text': 'What does this image show?',
                'question_type': 'mcq',
                'options': json.dumps([
                    {'id': 'a', 'text': 'Option A'},
                    {'id': 'b', 'text': 'Option B'},
                ]),
                'correct_answer': 'a',
                'difficulty_level': 'medium',
                'images': image,
            },
            format='multipart',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Question.objects.count(), 1)
        self.assertEqual(QuestionImage.objects.count(), 1)

    def test_create_wat_question_without_correct_answer(self):
        response = self.client.post(
            '/api/questions/questions/',
            {
                'test': str(self.test.id),
                'question_text': 'Name a word association for "water".',
                'question_type': 'wat',
                'options': json.dumps([]),
                'correct_answer': '',
                'difficulty_level': 'medium',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Question.objects.count(), 1)
        question = Question.objects.first()
        self.assertEqual(question.question_type, 'wat')
        self.assertEqual(question.correct_answer, '')
