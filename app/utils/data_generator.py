import requests
import base64
from faker import Faker
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.room import Room
from app.models.booking import Booking
fake = Faker("ru_RU")


STABILITY_API_KEY = "sk-2nRNs8H6dkcxNvOyCAxQxItnfg0CiWzvCMFFMFRidJL3fY5L"


def generate_room_photo(prompt):
    """Генерация фото через Stability AI API"""
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "text_prompts": [{"text": prompt, "weight": 1}],
        "cfg_scale": 7,
        "height": 512,
        "width": 512,
        "steps": 30,
        "samples": 1
    }

    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()  # Будет ошибка при неудачном запросе
    return base64.b64decode(response.json()["artifacts"][0]["base64"])


def generate_test_data():
    # Очистка старых данных
    db.session.query(Booking).delete()
    db.session.query(Room).delete()
    db.session.query(User).delete()

    # Создаем пользователей
    users = []
    for _ in range(10):
        user = User(email=fake.email())
        user.set_password("12345")
        users.append(user)
        db.session.add(user)

    # Создаем переговорки с фото
    for i in range(5):
        equipment = fake.random_element(["проектором", "маркерной доской", "телевизором"])
        room_name = f"Комната {fake.street_name()}"

        prompt = (
            f"Профессиональная фотография переговорной комнаты в современном стиле "
            f"с {equipment}, название комнаты '{room_name}', "
            "высокая детализация, реалистичное освещение, 4K"
        )

        rooms = []
        for _ in range(5):
            room = Room(
                name=fake.street_name() + " Room",
                capacity=fake.random_int(5, 20),
                equipment=fake.random_element(["Проектор", "Доска", "Телевизор"]),
                photo=generate_room_photo(prompt)
            )
            rooms.append(room)
            db.session.add(room)

        db.session.commit()

        # Создание бронирований
        for _ in range(20):
            user = fake.random_element(users)
            room = fake.random_element(rooms)
            start_time = fake.date_time_this_month()
            end_time = start_time + timedelta(hours=2)
            booking = Booking(
                user_id=user.id,
                room_id=room.id,
                start_time=start_time,
                end_time=end_time,
                participants=fake.random_int(1, room.capacity)
            )
            db.session.add(booking)
        db.session.commit()