from faker import Faker
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.room import Room
from app.models.booking import Booking

fake = Faker("ru_RU")  # Для русскоязычных данных (мем с котом: я руский)
def generate_test_data():
    # !Очистка старых данных!
    db.session.query(User).delete()
    db.session.query(Room).delete()
    db.session.query(Booking).delete()
    # Создание пользователей
    users = []
    for _ in range(10):
        user = User(email=fake.email())
        user.set_password("12345")
        users.append(user)
        db.session.add(user)
    # Создание переговорок
    rooms = []
    for _ in range(5):
        room = Room(
            name=fake.street_name() + " Room",
            capacity=fake.random_int(5, 20),
            equipment=fake.random_element(["Проектор", "Доска", "Телевизор"])
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