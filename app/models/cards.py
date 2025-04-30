from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import base64

app = Flask(__name__)
CORS(app)

def get_rooms():
    conn = sqlite3.connect('instance/database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, capacity, equipment, photo FROM rooms")
    rooms = []
    for row in cursor.fetchall():
        photo_blob = row[4]
        photo_base64 = (
            f"data:image/jpeg;base64,{base64.b64encode(photo_blob).decode('utf-8')}"
            if photo_blob else None
        )
        rooms.append({
            'id': row[0],
            'name': row[1],
            'capacity': row[2],
            'equipment': row[3],
            'photo': photo_base64
        })
    conn.close()
    return rooms

@app.route('/api/rooms', methods=['GET'])
def rooms():
    return jsonify(get_rooms())

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room_by_id(room_id):
    conn = sqlite3.connect('instance/database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, capacity, equipment, photo FROM rooms WHERE id = ?", (room_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        photo_base64 = (
            f"data:image/jpeg;base64,{base64.b64encode(row[4]).decode('utf-8')}"
            if row[4] else None
        )
        return jsonify({
            'id': row[0],
            'name': row[1],
            'capacity': row[2],
            'equipment': row[3],
            'photo': photo_base64
        })
    else:
        return jsonify({'error': 'Комната не найдена'}), 404

if __name__ == '__main__':
    app.run(debug=True)
