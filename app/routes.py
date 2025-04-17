from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from app import db
from app.models.user import User

# Инициализация Blueprints
auth_bp = Blueprint('auth', __name__)
main_bp = Blueprint('main', __name__)
booking_bp = Blueprint('booking', __name__)
room_bp = Blueprint('room', __name__)


# Аутентификация
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Валидация
    required_fields = ['name', 'email', 'password', 'confirm_password']
    if not data or not all(k in data for k in required_fields):
        return jsonify({'error': 'Не все поля заполнены'}), 400

    if data['password'] != data['confirm_password']:
        return jsonify({'error': 'Пароли не совпадают'}), 400

    if len(data['password']) < 8:
        return jsonify({'error': 'Пароль должен содержать минимум 8 символов'}), 400

    # Проверка существующего пользователя
    if db.session.query(db.exists().where(User.email == data['email'])).scalar():
        return jsonify({'error': 'Email уже зарегистрирован'}), 400

    try:
        user = User(
            name=data['name'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'Регистрация успешна',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Необходимы email и пароль'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        })

    return jsonify({'error': 'Неверный email или пароль'}), 401


@auth_bp.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Выход выполнен'})


@auth_bp.route('/api/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email
    })


# Переговорки
@room_bp.route('/api/rooms', methods=['GET'])
def get_rooms():
    from app.models.room import Room
    rooms = Room.query.all()
    return jsonify([{
        'id': r.id,
        'name': r.name,
        'capacity': r.capacity,
        'equipment': r.equipment
    } for r in rooms])


# Бронирования
@booking_bp.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    from app.models.booking import Booking
    from app.models.room import Room
    from datetime import datetime

    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        # Валидация данных
        required_fields = ['room_id', 'start_time', 'end_time', 'participants']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': 'Не все поля заполнены'}), 400

        # Проверка существования комнаты
        room = Room.query.get(data['room_id'])
        if not room:
            return jsonify({'error': 'Комната не найдена'}), 404

        # Проверка доступности времени
        conflicting_booking = Booking.query.filter(
            Booking.room_id == data['room_id'],
            Booking.start_time < datetime.fromisoformat(data['end_time']),
            Booking.end_time > datetime.fromisoformat(data['start_time'])
        ).first()

        if conflicting_booking:
            return jsonify({'error': 'Комната уже забронирована на это время'}), 400

        # Создание бронирования
        booking = Booking(
            user_id=user_id,
            room_id=data['room_id'],
            start_time=datetime.fromisoformat(data['start_time']),
            end_time=datetime.fromisoformat(data['end_time']),
            participants=data['participants']
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({
            'message': 'Бронирование создано',
            'booking_id': booking.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Healthcheck
@main_bp.route('/api/healthcheck')
def healthcheck():
    return jsonify({'status': 'API работает'})