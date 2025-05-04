# app/routes/api.py
from flask import request, jsonify, Blueprint
from app import db
from app.models.user import User
from app.models.room import Room
from datetime import date
from werkzeug.security import generate_password_hash

bp = Blueprint('api', __name__)

@bp.route('/register', methods=['POST'])
def register_api():
    data = request.get_json()

    # Проверка подтверждения пароля
    if data['password'] != data['confirm_password']:
        return jsonify({'error': 'Пароли не совпадают'}), 400

    # Проверка уникальности email
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email уже зарегистрирован'}), 400

    # Создание нового пользователя
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'Регистрация успешна'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Ошибка сервера'}), 500


@bp.route('/api/occupancy', methods=['GET'])
def get_occupancy():
    target_date_str = request.args.get('date', default=date.today().isoformat())
    target_date = date.fromisoformat(target_date_str)

    rooms = Room.query.all()
    data = []
    for room in rooms:
        # Расчет занятости через метод модели
        occupancy_rate = room.get_occupancy_rate(target_date)
        data.append({
            "id": room.id,
            "name": room.name,
            "occupancy_rate": occupancy_rate,
            "capacity": room.capacity
        })
    return jsonify(data)