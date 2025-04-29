from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Функция получения данных из базы
def get_rooms():
    conn = sqlite3.connect('instance/database.db')  # Убедись, что путь к базе корректен
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, image FROM rooms")
    rooms = cursor.fetchall()
    conn.close()
    return [{'id': row[0], 'name': row[1], 'description': row[2], 'image': row[3]} for row in rooms]

# Роут для API
@app.route('/api/rooms', methods=['GET'])
def rooms():
    return jsonify(get_rooms())

if __name__ == '__main__':
    app.run(debug=True)
