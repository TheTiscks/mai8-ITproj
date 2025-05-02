from app import db

class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    equipment = db.Column(db.String(200))  # Например: "Проектор, Доска"
    photo = db.Column(db.LargeBinary)  # Путь к изображению

    # Связь с бронированиями (один ко многим)
    bookings = db.relationship("Booking", backref="room", lazy=True)

    @property
    def occupancy_rate(self) -> float:
        timeStart = 9 * 60  # 9:00
        timeEnd = 20 * 60  # 20:00
        totalMinutes = timeEnd - timeStart
        booked_minutes = 0
        for booking in self.bookings:
            start_min = booking.start_time.hour * 60 + booking.start_time.minute
            end_min = booking.end_time.hour * 60 + booking.end_time.minute
            clamped_start = max(start_min, timeStart)
            clamped_end = min(end_min, timeEnd)
            if clamped_end > clamped_start:
                booked_minutes += (clamped_end - clamped_start)
        return round((booked_minutes / totalMinutes) * 100, 2) if totalMinutes > 0 else 0.0
