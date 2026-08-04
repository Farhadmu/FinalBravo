import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.tests.models import Test
from apps.questions.models import Question
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(username='admin')

# Create Test
test, created = Test.objects.get_or_create(
    name="General IQ Test - Basic",
    defaults={
        "description": "A basic IQ test to evaluate logical reasoning.",
        "duration_minutes": 30,
        "total_questions": 5,
        "price": 0.00,
        "is_free_sample": True,
        "created_by": admin
    }
)
print(f"Test '{test.name}' created/retrieved. ID: {test.id}")

# Create Questions
questions_data = [
    {
        "text": "Which number comes next in the series: 2, 6, 12, 20, 30, ...?",
        "options": [{"id": "a", "text": "40"}, {"id": "b", "text": "42"}, {"id": "c", "text": "44"}, {"id": "d", "text": "46"}],
        "correct": "b",
        "difficulty": "easy"
    },
    {
        "text": "Light is to Eye as Sound is to...?",
        "options": [{"id": "a", "text": "Ear"}, {"id": "b", "text": "Nose"}, {"id": "c", "text": "Hand"}, {"id": "d", "text": "Mouth"}],
        "correct": "a",
        "difficulty": "easy"
    },
    {
        "text": "If some A are B, and all B are C, then...?",
        "options": [{"id": "a", "text": "All A are C"}, {"id": "b", "text": "Some A are C"}, {"id": "c", "text": "No A are C"}, {"id": "d", "text": "None of the above"}],
        "correct": "b",
        "difficulty": "medium"
    },
     {
        "text": "Identify the odd one out.",
        "options": [{"id": "a", "text": "Dog"}, {"id": "b", "text": "Cat"}, {"id": "c", "text": "Tiger"}, {"id": "d", "text": "Snake"}],
        "correct": "d",
        "difficulty": "easy"
    },
    {
        "text": "Complete the analogy: Book : Page :: House : ?",
        "options": [{"id": "a", "text": "Door"}, {"id": "b", "text": "Window"}, {"id": "c", "text": "Brick"}, {"id": "d", "text": "Roof"}],
        "correct": "c",
        "difficulty": "medium"
    }
]

for i, q_data in enumerate(questions_data):
    q, created = Question.objects.get_or_create(
        test=test,
        question_text=q_data["text"],
        defaults={
            "question_type": "mcq",
            "options": q_data["options"],
            "correct_answer": q_data["correct"],
            "difficulty_level": q_data["difficulty"],
            "order": i + 1
        }
    )
    print(f"Question {i+1} created.")

print("Seeding complete.")
