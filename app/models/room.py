from app import db
from datetime import date, time, datetime

class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    equipment = db.Column(db.String(200))  # Например: "Проектор, Доска"
    photo = db.Column(db.LargeBinary)  # Путь к изображению

    # Связь с бронированиями (один ко многим)
    bookings = db.relationship("Booking", backref="room", lazy=True)

    def get_occupancy_rate(self, target_date: date = date.today()) -> float:
        WORK_START = time(9, 0)  # 09:00
        WORK_END = time(20, 0)  # 20:00
        # Фильтрация бронирований по текущей дате
        today_bookings = [
            booking for booking in self.bookings
            if booking.date == target_date
        ]
        total_seconds = (
                    datetime.combine(target_date, WORK_END) - datetime.combine(target_date, WORK_START)).total_seconds()
        total_minutes = total_seconds / 60  # 660 минут (11 часов)
        booked_minutes = 0
        for booking in today_bookings:
            # Конвертация времени в минуты
            start = max(booking.start_time, WORK_START)
            end = min(booking.end_time, WORK_END)

            if end > start:
                duration = (datetime.combine(target_date, end) - datetime.combine(target_date,
                                                                                  start)).total_seconds() / 60
                booked_minutes += duration

        return round((booked_minutes / total_minutes) * 100, 2) if total_minutes > 0 else 0.0
