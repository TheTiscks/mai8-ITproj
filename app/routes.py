from datetime import datetime, timedelta, timezone
from app.models.booking import Booking
from app.models.room import Room
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from app import db
from app.models.user import User
from flask import request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import booking, room, user
from . import db

import sqlite3
import base64
import pytz

# Инициализация Blueprints
auth_bp = Blueprint('auth', __name__)
main_bp = Blueprint('main', __name__)
booking_bp = Blueprint('booking', __name__)
room_bp = Blueprint('room', __name__)

# Путь к вашей SQLite-базе
DB_PATH = 'instance/database.db'


def detect_mime(blob: bytes) -> str:
    """Определяем MIME-тип JPEG или PNG по сигнатуре."""
    if blob.startswith(b'\xFF\xD8\xFF'):
        return 'image/jpeg'
    if blob.startswith(b'\x89PNG'):
        return 'image/png'
    return 'application/octet-stream'


# Аутентификация ------------------

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['name', 'email', 'password', 'confirm_password']
    if not data or not all(k in data for k in required_fields):
        return jsonify({'error': 'Не все поля заполнены'}), 400
    if data['password'] != data['confirm_password']:
        return jsonify({'error': 'Пароли не совпадают'}), 400
    if len(data['password']) < 8:
        return jsonify({'error': 'Пароль должен содержать минимум 8 символов'}), 400
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
            'user': {'id': user.id, 'name': user.name, 'email': user.email}
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
            'user': {'id': user.id, 'name': user.name, 'email': user.email}
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
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email})


# Переговорки: список всех комнат с фото и описанием --------------

@room_bp.route('/api/rooms', methods=['GET'])
def list_rooms():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, capacity, equipment, photo FROM rooms")
    rooms = []
    for id_, name, cap, eq, blob in cursor.fetchall():
        img = None
        if blob:
            mime = detect_mime(blob)
            b64 = base64.b64encode(blob).decode('utf-8')
            img = f"data:{mime};base64,{b64}"
        rooms.append({
            'id': id_,
            'name': name,
            'capacity': cap,
            'equipment': eq,
            'image': img,
            'description': f"Вместимость: {cap} чел. Оборудование: {eq}"
        })
    conn.close()
    return jsonify(rooms)


# Переговорка по ID: детали одной комнаты ------------------------

@room_bp.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, capacity, equipment, photo FROM rooms WHERE id = ?",
        (room_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Комната не найдена'}), 404

    id_, name, cap, eq, blob = row
    img = None
    if blob:
        mime = detect_mime(blob)
        b64 = base64.b64encode(blob).decode('utf-8')
        img = f"data:{mime};base64,{b64}"
    return jsonify({
        'id': id_,
        'name': name,
        'capacity': cap,
        'equipment': eq,
        'image': img,
        'description': f"Вместимость: {cap} чел. Оборудование: {eq}"
    })


# Бронирования ------------------------

@booking_bp.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    print("Получен запрос на бронирование:", request.json)
    try:
        # 1. Проверка данных
        if not request.is_json:
            return jsonify({"error": "Требуется JSON"}), 400

        data = request.get_json()

        # 2. Валидация полей
        required_fields = ['room_id', 'start_time', 'end_time']
        if not all(field in data for field in required_fields):
            return jsonify({
                "error": "Отсутствуют обязательные поля",
                "required_fields": required_fields
            }), 400

        # 3. Парсинг времени с учетом часового пояса
        try:
            # Указываем, что время приходит в UTC+3 (Московское время)
            tz = pytz.timezone('Europe/Moscow')
            start = datetime.fromisoformat(data['start_time']).astimezone(tz)
            end = datetime.fromisoformat(data['end_time']).astimezone(tz)

            # Конвертируем в UTC для хранения в БД
            start_utc = start.astimezone(pytz.utc)
            end_utc = end.astimezone(pytz.utc)
        except ValueError as e:
            return jsonify({
                "error": "Неверный формат времени",
                "details": str(e),
                "expected_format": "YYYY-MM-DDTHH:MM:SS+03:00 (Московское время)"
            }), 422

        # 4. Проверка времени
        if start >= end:
            return jsonify({
                "error": "Некорректный временной интервал",
                "details": "Время окончания должно быть позже времени начала"
            }), 422

        # 5. Проверка что бронирование не в прошлом
        if start < datetime.now(tz):
            return jsonify({
                "error": "Некорректное время",
                "details": "Нельзя забронировать время в прошлом"
            }), 422

        # 6. Проверка существования комнаты
        room = Room.query.get(data['room_id'])
        if not room:
            return jsonify({"error": "Комната не найдена"}), 404

        # 7. Проверка на пересечение бронирований
        overlapping_booking = Booking.query.filter(
            Booking.room_id == data['room_id'],
            Booking.start_time < end_utc,
            Booking.end_time > start_utc
        ).first()

        if overlapping_booking:
            # Конвертируем обратно в московское время для отображения
            overlap_start = overlapping_booking.start_time.astimezone(tz)
            overlap_end = overlapping_booking.end_time.astimezone(tz)
            return jsonify({
                "error": "Время уже занято",
                "details": f"Занято с {overlap_start.strftime('%H:%M')} до {overlap_end.strftime('%H:%M')}"
            }), 409

        # 8. Создание брони
        booking = Booking(
            user_id=get_jwt_identity(),
            room_id=data['room_id'],
            start_time=start_utc,
            end_time=end_utc,
            participants=data.get('participants', 1)
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({
            "message": "Бронирование создано",
            "booking_id": booking.id,
            "time": f"{start.strftime('%H:%M')} - {end.strftime('%H:%M')}",
            "date": start.strftime('%d.%m.%Y')
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Ошибка сервера",
            "details": str(e)
        }), 500


@booking_bp.route('/api/rooms/<int:room_id>/availability', methods=['GET'])
def get_availability(room_id):
    # 1. Проверка параметра даты
    date = request.args.get('date')
    if not date:
        return jsonify({'error': 'Параметр date обязателен'}), 400

    # 2. Проверка существования комнаты
    if not Room.query.get(room_id):
        return jsonify({'error': 'Комната не найдена'}), 404

    # 3. Парсинг даты с валидацией
    try:
        tz = pytz.timezone('Europe/Moscow')
        target_date = datetime.fromisoformat(date).date()
        if target_date < datetime.now(tz).date():
            return jsonify({'error': 'Дата не может быть в прошлом'}), 400
    except ValueError:
        return jsonify({
            'error': 'Неверный формат даты',
            'example': '2023-12-31'
        }), 400

    # 4. Оптимизированный запрос к БД
    booked_slots = db.session.query(
        Booking.start_time,
        Booking.end_time
    ).filter(
        Booking.room_id == room_id,
        db.func.date(Booking.start_time) == target_date
    ).all()

    # 5. Конвертация времени в московский часовой пояс
    booked_slots_local = []
    for slot in booked_slots:
        start_local = slot.start_time.astimezone(tz)
        end_local = slot.end_time.astimezone(tz)
        booked_slots_local.append({
            'start': start_local.time().strftime('%H:%M'),
            'end': end_local.time().strftime('%H:%M')
        })

    # 6. Форматирование ответа
    return jsonify({
        'room_id': room_id,
        'date': date,
        'available': len(booked_slots) == 0,
        'booked_slots': booked_slots_local,
        'time_zone': 'Europe/Moscow'
    })


# Healthcheck
@main_bp.route('/api/healthcheck')
def healthcheck():
    return jsonify({'status': 'API работает'})