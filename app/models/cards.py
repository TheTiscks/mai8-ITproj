# Илья, мы знаем, в каком мы файле
from flask import Blueprint, jsonify
from app.models.room import Room
import sqlite3, base64

cards_bp = Blueprint('cards', __name__)

DB = 'instance/database.db'

def detect_mime(blob: bytes) -> str:
    if blob.startswith(b'\xFF\xD8\xFF'):
        return 'image/jpeg'
    if blob.startswith(b'\x89PNG'):
        return 'image/png'
    return 'application/octet-stream'

@cards_bp.route('/api/rooms', methods=['GET'])
def list_rooms():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, capacity, equipment, photo FROM rooms")
    rooms = []
    for id, name, capacity, equipment, photo_blob in cursor.fetchall():
        img = None
        if photo_blob:
            mime = detect_mime(photo_blob)
            img = f"data:{mime};base64,{base64.b64encode(photo_blob).decode()}"
        room = Room.query.get(id)
        occupancy_rate = room.get_occupancy_rate() if room else 0.0
        rooms.append({
            'id': id,
            'name': name,
            'capacity': capacity,
            'occupancy_rate': occupancy_rate,
            'equipment': equipment,
            'image': img,
            'description': f"Вместимость: {capacity} чел. Оборудование: {equipment}"
        })
    conn.close()
    return jsonify(rooms)

@cards_bp.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, capacity, equipment, photo FROM rooms WHERE id = ?",
        (room_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Комната не найдена'}), 404

    id, name, capacity, equipment, photo_blob = row
    img = None
    if photo_blob:
        mime = detect_mime(photo_blob)
        img = f"data:{mime};base64,{base64.b64encode(photo_blob).decode()}"
    return jsonify({
        'id': id,
        'name': name,
        'capacity': capacity,
        'equipment': equipment,
        'image': img,
        'description': f"Вместимость: {capacity} чел. Оборудование: {equipment}"
    })
