import requests
from faker import Faker
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.room import Room
from app.models.booking import Booking
import time
import io
from PIL import Image

fake = Faker("ru_RU")


def generate_room_photo(prompt):
    """Генерация фото переговорки через Pollinations API"""
    try:
        # Формируем точный промпт для переговорных комнат
        enhanced_prompt = (
            f"{prompt}, профессиональная фотография, "
            "современный офисный интерьер, "
            "высокая детализация, 8K resolution, "
            "реалистичное освещение, стиль: бизнес-каталог, "
            "вид из угла комнаты, стол и стулья, "
            "нейтральные цвета (серый, бежевый, синий)"
        )

        url = f"https://image.pollinations.ai/prompt/{enhanced_prompt}"

        # Не менять иначе шакал HD
        params = {
            'width': 512,
            'height': 512,
            'nologo': 'true'
        }

        response = requests.get(url, params=params, stream=True, timeout=30)
        response.raise_for_status()

        # Перевод в байтсы КФС что бы в БД норм выводилось
        img = Image.open(io.BytesIO(response.content))
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG', quality=85)

        return img_byte_arr.getvalue()

    except Exception as e:
        print(f"Ошибка генерации: {str(e)}")
        return None


def generate_test_data():
    """Генерация тестовых данных с реалистичными переговорками"""
    print("=== Начало генерации ===")

    # Очистка БД
    try:
        with db.session.begin():
            db.session.query(Booking).delete()
            db.session.query(Room).delete()
            db.session.query(User).delete()
        print("База данных очищена")
    except Exception as e:
        print(f"Ошибка очистки БД: {str(e)}")
        return

    # Создаем пользователей
    users = []
    for i in range(3):
        try:
            user = User(
                email=fake.unique.email(),
                password_hash="12345"
            )
            db.session.add(user)
            users.append(user)
            print(f"Создан пользователь {i + 1}/3")
        except Exception as e:
            print(f"Ошибка создания пользователя: {str(e)}")

    db.session.commit()

    # Тут чисто описание че генерим
    ROOM_TEMPLATES = [
        {
            "type": "Конференц-зал",
            "equipment": "проектор, экран, система видеоконференций",
            "prompt_add": "большой овальный стол на 10 персон, кожаные кресла"
        },
        {
            "type": "Бизнес-переговорка",
            "equipment": "интерактивная доска, телевизор",
            "prompt_add": "круглый стол на 6 персон, стеклянные стены"
        },
        {
            "type": "Малый переговорный зал",
            "equipment": "флипчарт, монитор",
            "prompt_add": "прямоугольный стол на 4 персоны, современные стулья"
        }
    ]

    # Создаем комнаты
    rooms = []
    for i, template in enumerate(ROOM_TEMPLATES):
        try:
            room_name = f"{template['type']} {fake.street_name()}"

            # Делаем кайфовый промпт
            prompt = (
                f"Фото {template['type'].lower()} в бизнес-центре, "
                f"{template['prompt_add']}, оборудование: {template['equipment']}, "
                "профессиональный дизайн интерьера, реалистичное освещение"
            )

            print(f"\nГенерация {room_name}...")
            print(f"Промпт: {prompt[:120]}...")

            photo_data = generate_room_photo(prompt)

            room = Room(
                name=room_name,
                capacity=fake.random_int(4, 12),
                equipment=template["equipment"],
                photo=photo_data if photo_data else b''
            )
            db.session.add(room)
            rooms.append(room)

            # Ограничение API - 1 запрос в 5 секунд
            time.sleep(5)

        except Exception as e:
            print(f"Ошибка создания комнаты: {str(e)}")

    db.session.commit()

    # Создаем бронирования
    if users and rooms:
        for i in range(15):
            try:
                booking = Booking(
                    user_id=fake.random_element(users).id,
                    room_id=fake.random_element(rooms).id,
                    start_time=fake.date_time_this_month(),
                    end_time=fake.date_time_this_month() + timedelta(hours=2),
                    participants=fake.random_int(1, 6)
                )
                db.session.add(booking)
                print(f"Создано бронирование {i + 1}/15", end="\r")
            except Exception as e:
                print(f"Ошибка создания бронирования: {str(e)}")

        db.session.commit()

    print("\n=== Генерация завершена успешно ===")