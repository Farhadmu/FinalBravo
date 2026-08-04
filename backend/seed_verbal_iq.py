"""
Seed script for IQ-01 Verbal IQ Test questions.
Run: python seed_verbal_iq.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.questions.models import Question
from apps.tests.models import Test

TEST_ID = '1038f1eb-6fc7-4957-b815-558c89971117'

questions_data = [
    {
        "question_text": "Rearrange the jumble word: ATRCSFNAM = Name of a maker (Fill the last letter)",
        "options": [{"id": "a", "text": "C"}, {"id": "b", "text": "T"}, {"id": "c", "text": "R"}, {"id": "d", "text": "N"}, {"id": "e", "text": "M"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Father is 3 times as old as son. In 10 years he will be twice as old. How old is the father at present?",
        "options": [{"id": "a", "text": "30"}, {"id": "b", "text": "25"}, {"id": "c", "text": "26"}, {"id": "d", "text": "29"}, {"id": "e", "text": "31"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "3 have the same ration to 15x as 5x has to?",
        "options": [{"id": "a", "text": "25"}, {"id": "b", "text": "25x"}, {"id": "c", "text": "25x²"}, {"id": "d", "text": "15"}, {"id": "e", "text": "15x"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Water is to pipe as Electricity is to?",
        "options": [{"id": "a", "text": "Steel"}, {"id": "b", "text": "Wire"}, {"id": "c", "text": "Rod"}, {"id": "d", "text": "Aluminum"}, {"id": "e", "text": "Gold"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "LORU = HLPT as TWSQ = ?",
        "options": [{"id": "a", "text": "PPTQ"}, {"id": "b", "text": "PPQT"}, {"id": "c", "text": "PTPQ"}, {"id": "d", "text": "PQTP"}, {"id": "e", "text": "PQPP"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Find the odd: (a) 1824 AD (b) 1912 AD (c) 2024 AD (d) 2007 AD (e) 1757 AD",
        "options": [{"id": "a", "text": "1824 AD"}, {"id": "b", "text": "1912 AD"}, {"id": "c", "text": "2024 AD"}, {"id": "d", "text": "2007 AD"}, {"id": "e", "text": "1757 AD"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Find the odd: (a) Good (b) Holy (c) Pious (d) Atheist (e) Theist",
        "options": [{"id": "a", "text": "Good"}, {"id": "b", "text": "Holy"}, {"id": "c", "text": "Pious"}, {"id": "d", "text": "Atheist"}, {"id": "e", "text": "Theist"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "If 2514 is to BEAD, 8945 is to HIDE then 6554 is to?",
        "options": [{"id": "a", "text": "FEED"}, {"id": "b", "text": "DEED"}, {"id": "c", "text": "READ"}, {"id": "d", "text": "MIND"}, {"id": "e", "text": "GOOD"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "January is to February as First is to?",
        "options": [{"id": "a", "text": "Four"}, {"id": "b", "text": "Last"}, {"id": "c", "text": "Second"}, {"id": "d", "text": "Five"}, {"id": "e", "text": "None of these"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Angle is to Heaven as Devil is to?",
        "options": [{"id": "a", "text": "Good"}, {"id": "b", "text": "Bad"}, {"id": "c", "text": "Evil"}, {"id": "d", "text": "Culprit"}, {"id": "e", "text": "None of these"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "What is that which is found once in Flower, twice in SEEDS but never in FRUIT?",
        "options": [{"id": "a", "text": "E"}, {"id": "b", "text": "F"}, {"id": "c", "text": "O"}, {"id": "d", "text": "S"}, {"id": "e", "text": "R"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 5, 20, 6, 24, 7, 28, ? ?",
        "options": [{"id": "a", "text": "26,32"}, {"id": "b", "text": "5,31"}, {"id": "c", "text": "6,31"}, {"id": "d", "text": "8,32"}, {"id": "e", "text": "7,30"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Insert the missing number: (E G I), (J M P), (Q U ?) ",
        "options": [{"id": "a", "text": "P"}, {"id": "b", "text": "X"}, {"id": "c", "text": "Y"}, {"id": "d", "text": "Z"}, {"id": "e", "text": "R"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Ink is to Pen as Lead is to? (Find the odd)",
        "options": [{"id": "a", "text": "Knife"}, {"id": "b", "text": "Book"}, {"id": "c", "text": "Table"}, {"id": "d", "text": "Pencil"}, {"id": "e", "text": "Ruler"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Find the odd: (a) Mare (b) Lass (c) Filly (d) Fox (e) Hen",
        "options": [{"id": "a", "text": "Mare"}, {"id": "b", "text": "Lass"}, {"id": "c", "text": "Filly"}, {"id": "d", "text": "Fox"}, {"id": "e", "text": "Hen"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "If REST is coded as 0987 & BEAST is coded as 29187 then what stands for BREAST?",
        "options": [{"id": "a", "text": "209188"}, {"id": "b", "text": "209197"}, {"id": "c", "text": "209147"}, {"id": "d", "text": "209287"}, {"id": "e", "text": "209187"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "JIK = POQ as DCE = ?",
        "options": [{"id": "a", "text": "PIP"}, {"id": "b", "text": "UKI"}, {"id": "c", "text": "JIK"}, {"id": "d", "text": "JKL"}, {"id": "e", "text": "PLK"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 71, 65, 61, 55, 51, 45, ? ?",
        "options": [{"id": "a", "text": "26,32"}, {"id": "b", "text": "45,31"}, {"id": "c", "text": "41,35"}, {"id": "d", "text": "40,32"}, {"id": "e", "text": "35,30"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: A D G, J M P, ?",
        "options": [{"id": "a", "text": "SVY"}, {"id": "b", "text": "SYY"}, {"id": "c", "text": "SXY"}, {"id": "d", "text": "SZY"}, {"id": "e", "text": "SZZ"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: RASMIARCH = Name of a furniture (Fill the last letter)",
        "options": [{"id": "a", "text": "A"}, {"id": "b", "text": "M"}, {"id": "c", "text": "R"}, {"id": "d", "text": "S"}, {"id": "e", "text": "C"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 21, 5, 19, 7, 17, 9, ? ?",
        "options": [{"id": "a", "text": "20,32"}, {"id": "b", "text": "15,11"}, {"id": "c", "text": "21,25"}, {"id": "d", "text": "13,12"}, {"id": "e", "text": "15,14"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: EGDIRBYEKNOM = Name of an obstacle (Fill the 4th letter)",
        "options": [{"id": "a", "text": "E"}, {"id": "b", "text": "M"}, {"id": "c", "text": "R"}, {"id": "d", "text": "K"}, {"id": "e", "text": "D"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Find the odd: (a) Dutiful (b) Cheerful (c) Beautiful (d) Handful (e) Careful",
        "options": [{"id": "a", "text": "Dutiful"}, {"id": "b", "text": "Cheerful"}, {"id": "c", "text": "Beautiful"}, {"id": "d", "text": "Handful"}, {"id": "e", "text": "Careful"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Inam is 6 times as old in 50 years as he is now. What is his present age?",
        "options": [{"id": "a", "text": "10"}, {"id": "b", "text": "12"}, {"id": "c", "text": "13"}, {"id": "d", "text": "9"}, {"id": "e", "text": "8"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Which country has the greatest mileage of railway?",
        "options": [{"id": "a", "text": "Bangladesh"}, {"id": "b", "text": "Japan"}, {"id": "c", "text": "Korea"}, {"id": "d", "text": "USA"}, {"id": "e", "text": "KSA"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 72, 60, 54, 42, 36, ? ?",
        "options": [{"id": "a", "text": "20,25"}, {"id": "b", "text": "24,18"}, {"id": "c", "text": "32,33"}, {"id": "d", "text": "35,36"}, {"id": "e", "text": "22,17"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: FIDCFITULY. 1st letter",
        "options": [{"id": "a", "text": "T"}, {"id": "b", "text": "D"}, {"id": "c", "text": "I"}, {"id": "d", "text": "C"}, {"id": "e", "text": "U"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "CJKL = GMTV as ICMA = ?",
        "options": [{"id": "a", "text": "MFKV"}, {"id": "b", "text": "MFKV"}, {"id": "c", "text": "MKVF"}, {"id": "d", "text": "MVKF"}, {"id": "e", "text": "MVFK"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: ATRCSFNAM. 3rd letter",
        "options": [{"id": "a", "text": "T"}, {"id": "b", "text": "R"}, {"id": "c", "text": "C"}, {"id": "d", "text": "F"}, {"id": "e", "text": "A"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 7, 21, 3, 5, 30, ? ?",
        "options": [{"id": "a", "text": "3,3"}, {"id": "b", "text": "6,7"}, {"id": "c", "text": "6,8"}, {"id": "d", "text": "8,3"}, {"id": "e", "text": "6,3"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: RESAUPLE = Part of past time. (Fill the 3rd letter)",
        "options": [{"id": "a", "text": "P"}, {"id": "b", "text": "R"}, {"id": "c", "text": "U"}, {"id": "d", "text": "S"}, {"id": "e", "text": "E"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Robinson Cruso is a novel about a man on?",
        "options": [{"id": "a", "text": "A voyage"}, {"id": "b", "text": "An island"}, {"id": "c", "text": "A travel"}, {"id": "d", "text": "A country"}, {"id": "e", "text": "None of these"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 8, 3, 4, 9, 4, 6, ? ?",
        "options": [{"id": "a", "text": "3,9"}, {"id": "b", "text": "6,5"}, {"id": "c", "text": "9,8"}, {"id": "d", "text": "10,5"}, {"id": "e", "text": "11,6"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: RILSAO = Name of a profession (Fill the last letter)",
        "options": [{"id": "a", "text": "S"}, {"id": "b", "text": "I"}, {"id": "c", "text": "L"}, {"id": "d", "text": "O"}, {"id": "e", "text": "R"}],
        "correct_answer": "e",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 15, 29, 59, 117, 235, ? ?",
        "options": [{"id": "a", "text": "469,592"}, {"id": "b", "text": "495,539"}, {"id": "c", "text": "485,539"}, {"id": "d", "text": "449,529"}, {"id": "e", "text": "469,539"}],
        "correct_answer": "e",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: TEAYUB = Part of attraction. (Fill the 3rd letter)",
        "options": [{"id": "a", "text": "B"}, {"id": "b", "text": "A"}, {"id": "c", "text": "E"}, {"id": "d", "text": "Y"}, {"id": "e", "text": "T"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Normal temperature of human body is?",
        "options": [{"id": "a", "text": "97.4f"}, {"id": "b", "text": "98.4f"}, {"id": "c", "text": "99.4f"}, {"id": "d", "text": "100f"}, {"id": "e", "text": "105f"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "If ADD stands for 122, KISS for 3455 & CLASS for 67155 then what about SAD?",
        "options": [{"id": "a", "text": "518"}, {"id": "b", "text": "516"}, {"id": "c", "text": "513"}, {"id": "d", "text": "512"}, {"id": "e", "text": "515"}],
        "correct_answer": "e",
        "question_type": "mcq",
    },
    {
        "question_text": "Bars lay eggs.",
        "options": [{"id": "a", "text": "True"}, {"id": "b", "text": "False"}],
        "correct_answer": "b",
        "question_type": "true_false",
    },
    {
        "question_text": "Complete the series: 7, 10, 20, 23, 46, 49, ? ?",
        "options": [{"id": "a", "text": "98,102"}, {"id": "b", "text": "98,101"}, {"id": "c", "text": "99,100"}, {"id": "d", "text": "100,104"}, {"id": "e", "text": "105,107"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Provide the missing number: C F I, K P U, H Q?",
        "options": [{"id": "a", "text": "S"}, {"id": "b", "text": "I"}, {"id": "c", "text": "L"}, {"id": "d", "text": "Z"}, {"id": "e", "text": "R"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Find the odd: (a) Bullock (b) Cart (c) Car (d) Truck (e) Wagon",
        "options": [{"id": "a", "text": "Bullock"}, {"id": "b", "text": "Cart"}, {"id": "c", "text": "Car"}, {"id": "d", "text": "Truck"}, {"id": "e", "text": "Wagon"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: ONHSEYT = Name of a virtue (Fill the last letter)",
        "options": [{"id": "a", "text": "S"}, {"id": "b", "text": "T"}, {"id": "c", "text": "H"}, {"id": "d", "text": "O"}, {"id": "e", "text": "Y"}],
        "correct_answer": "e",
        "question_type": "mcq",
    },
    {
        "question_text": "Danger it comes where often feared danger.",
        "options": [{"id": "a", "text": "True"}, {"id": "b", "text": "False"}],
        "correct_answer": "a",
        "question_type": "true_false",
    },
    {
        "question_text": "Rearrange the jumble word: RASMIARCH = Name of a furniture (Fill the 4th letter)",
        "options": [{"id": "a", "text": "S"}, {"id": "b", "text": "R"}, {"id": "c", "text": "H"}, {"id": "d", "text": "M"}, {"id": "e", "text": "I"}],
        "correct_answer": "d",
        "question_type": "mcq",
    },
    {
        "question_text": "Divide 500 into two parts such that one third of the first part is more by 60 than one-fifth of the second part.",
        "options": [{"id": "a", "text": "300,300"}, {"id": "b", "text": "500,200"}, {"id": "c", "text": "300,200"}, {"id": "d", "text": "200,100"}, {"id": "e", "text": "400,200"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: 6 15 9, 3 7 4, 2 ? 13",
        "options": [{"id": "a", "text": "25"}, {"id": "b", "text": "20"}, {"id": "c", "text": "22"}, {"id": "d", "text": "14"}, {"id": "e", "text": "15"}],
        "correct_answer": "b",
        "question_type": "mcq",
    },
    {
        "question_text": "Command is to Order as Bold is to?",
        "options": [{"id": "a", "text": "Defy"}, {"id": "b", "text": "Fearless"}, {"id": "c", "text": "Daring"}, {"id": "d", "text": "Courage"}, {"id": "e", "text": "None of these"}],
        "correct_answer": "c",
        "question_type": "mcq",
    },
    {
        "question_text": "Complete the series: C, O, G, S, ? ?",
        "options": [{"id": "a", "text": "KW"}, {"id": "b", "text": "PW"}, {"id": "c", "text": "WQ"}, {"id": "d", "text": "WR"}, {"id": "e", "text": "WP"}],
        "correct_answer": "a",
        "question_type": "mcq",
    },
    {
        "question_text": "Rearrange the jumble word: YKSIWH = Name of a drink (Fill the 3rd letter)",
        "options": [{"id": "a", "text": "W"}, {"id": "b", "text": "Y"}, {"id": "c", "text": "K"}, {"id": "d", "text": "S"}, {"id": "e", "text": "I"}],
        "correct_answer": "e",
        "question_type": "mcq",
    },
]

def seed_questions():
    try:
        test = Test.objects.get(id=TEST_ID)
        print(f"✅ Found test: {test.name}")
    except Test.DoesNotExist:
        print(f"❌ Test not found with ID: {TEST_ID}")
        return

    # Delete existing questions for this test
    existing = Question.objects.filter(test=test)
    count = existing.count()
    if count > 0:
        existing.delete()
        print(f"🗑️  Deleted {count} existing questions")

    # Add new questions
    created = 0
    for i, q in enumerate(questions_data):
        Question.objects.create(
            test=test,
            question_text=q["question_text"],
            question_type=q["question_type"],
            options=q["options"],
            correct_answer=q["correct_answer"],
            difficulty_level="medium",
            order=i + 1,
            bank_order=i + 1,
        )
        created += 1
        print(f"  ✓ Added Q{i+1}: {q['question_text'][:50]}...")

    print(f"\n🎉 Successfully added {created} questions to '{test.name}'!")

if __name__ == '__main__':
    seed_questions()
