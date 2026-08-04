import csv
import os
import sys
import django
from pathlib import Path
from django.core.files import File

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
django.setup()

from apps.tests.models import Test
from apps.questions.models import Question, QuestionImage


def load_test(test_id=None, test_name=None):
    if test_id:
        return Test.objects.get(id=test_id)
    if test_name:
        return Test.objects.get(name=test_name)
    raise ValueError('Either --test-id or --test-name is required.')


def parse_options(row):
    options = []
    for key in ['option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'option_f', 'option_g', 'option_h']:
        if key in row and row[key].strip():
            opt_id = key.split('_')[-1]
            options.append({'id': opt_id, 'text': row[key].strip()})
    return options


def create_question_from_row(test, row):
    question_text = row.get('question_text', '').strip()
    if not question_text:
        raise ValueError('Missing question_text for row: {}'.format(row))

    options = parse_options(row)
    correct_answer = row.get('correct_answer', '').strip()
    difficulty_level = row.get('difficulty_level', 'medium').strip().lower() or 'medium'
    explanation = row.get('explanation', '').strip()
    order = int(row.get('order', '0') or 0)

    question = Question.objects.create(
        test=test,
        question_text=question_text,
        question_type='mcq',
        options=options,
        correct_answer=correct_answer,
        difficulty_level=difficulty_level,
        order=order,
        explanation=explanation,
    )
    return question


def attach_image(question, images_dir, image_filename, caption, image_order):
    if not image_filename:
        return None

    image_path = Path(images_dir) / image_filename
    if not image_path.exists():
        print(f'  Warning: image file not found: {image_path}')
        return None

    with open(image_path, 'rb') as f:
        image_file = File(f, name=image_filename)
        q_image = QuestionImage.objects.create(
            question=question,
            image=image_file,
            caption=caption or '',
            order=image_order,
        )
    return q_image


def import_questions(csv_path, images_dir, test_id=None, test_name=None, delete_existing=False):
    test = load_test(test_id=test_id, test_name=test_name)
    print(f'Using test: {test.name} ({test.id})')

    if delete_existing:
        deleted = Question.objects.filter(test=test).delete()
        print(f'Deleted existing questions for test: {deleted}')

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        created_count = 0
        for row in reader:
            question = create_question_from_row(test, row)
            image_filename = row.get('image_filename', '').strip()
            caption = row.get('image_caption', '').strip()
            image_order = int(row.get('image_order', '0') or 0)

            if image_filename:
                attach_image(question, images_dir, image_filename, caption, image_order)
                print(f'Created question {question.id} with image {image_filename}')
            else:
                print(f'Created question {question.id} without image')

            created_count += 1

    test.total_questions = Question.objects.filter(test=test).count()
    test.save(update_fields=['total_questions'])
    print(f'Imported {created_count} questions. Test total_questions updated to {test.total_questions}.')


def print_usage():
    print('Usage: python import_verbal_with_images.py <questions.csv> <images_dir> --test-name "Verbal IQ" [--delete-existing]')
    print('CSV columns: question_text, correct_answer, order, difficulty_level, explanation, image_filename, image_caption, image_order, option_a ... option_h')


if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) < 3:
        print_usage()
        sys.exit(1)

    csv_path = args[0]
    images_dir = args[1]
    test_arg = args[2:]
    test_id = None
    test_name = None
    delete_existing = False

    for token in test_arg:
        if token.startswith('--test-id='):
            test_id = token.split('=', 1)[1]
        elif token.startswith('--test-name='):
            test_name = token.split('=', 1)[1]
        elif token == '--delete-existing':
            delete_existing = True
        else:
            print(f'Unknown argument: {token}')
            print_usage()
            sys.exit(1)

    import_questions(csv_path, images_dir, test_id=test_id, test_name=test_name, delete_existing=delete_existing)
