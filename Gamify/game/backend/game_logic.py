import random

def generate_question():
    a = random.randint(2, 12)
    b = random.randint(2, 12)
    return {
        "question": f"{a} × {b}",
        "a": a,
        "b": b,
        "answer": a * b
    }

def check_answer(question, submitted_answer):
    try:
        return int(submitted_answer) == question['answer']
    except:
        return False
