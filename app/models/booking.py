import pytz

from app import db
from datetime import datetime, date, time

class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  # Новое поле для даты
    start_time = db.Column(db.Time, nullable=False)  # Изменено с DateTime на Time
    end_time = db.Column(db.Time, nullable=False)   # Изменено с DateTime на Time
    participants = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Europe/Moscow')))


    # Отношения остаются без изменений
    user = db.relationship('User', back_populates='bookings')
    room = db.relationship('Room', back_populates='bookings')

    def __repr__(self):
        return f'<Booking {self.id}>'