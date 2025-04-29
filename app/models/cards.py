from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Функция получения данных из базы
def get_rooms():
    conn = sqlite3.connect('instance/database.db')  # Убедись, что путь корректный
    conn.row_factory = sqlite3.Row  # Чтобы можно было обращаться к колонкам по имени
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, capacity, equipment, photo FROM rooms")
    rooms = cursor.fetchall()
    conn.close()
    return [
        {
            'id': row['id'],
            'name': row['name'],
            'description': row['equipment'],  # будем использовать оборудование как описание
            'capacity': row['capacity'],
            'image': row['photo']  # если это URL, фронт покажет; если путь — нужно отдать статику
        } for row in rooms
    ]

# Роут для API
@app.route('/api/rooms', methods=['GET'])
def rooms():
    return jsonify(get_rooms())

if __name__ == '__main__':
    app.run(debug=True)
