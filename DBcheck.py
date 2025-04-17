from app import create_app, db
from sqlalchemy import text  # Важно: импортируем text

app = create_app()

with app.app_context():
    # Вариант 1: С использованием text()
    result = db.session.execute(text("PRAGMA table_info(users)")).fetchall()
    print("Структура таблицы users:")
    for column in result:
        print(column)