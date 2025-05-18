from app import db

# room.py
class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    equipment = db.Column(db.String(200))
    photo_path = db.Column(db.String(200))  # Новое поле для пути к изображению


    # Отношения
    bookings = db.relationship('Booking', back_populates='room', lazy=True)