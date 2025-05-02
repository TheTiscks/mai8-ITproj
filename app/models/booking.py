from app import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  # Новое поле для даты бронирования
    start_time = db.Column(db.Time, nullable=False)  # Было DateTime → Time
    end_time = db.Column(db.Time, nullable=False)  # Было DateTime → Time
    participants = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Booking {self.id} (Room: {self.room_id})>'