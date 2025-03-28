from app import db

class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    equipment = db.Column(db.String(200))  # Например: "Проектор, Доска"
    photo = db.Column(db.String(200))  # Путь к изображению

    # Связь с бронированиями (один ко многим)
    bookings = db.relationship("Booking", backref="room", lazy=True)