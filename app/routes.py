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
from flask import send_file
import io
import matplotlib
matplotlib.use('Agg')   # переключаемся на серверный бэкенд, без GUI
import matplotlib.pyplot as plt

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
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role  # ← добавили
    })


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
    try:
        data = request.get_json()
        required_fields = ['room_id', 'date', 'start_time', 'end_time']

        # Проверка обязательных полей
        if not all(field in data for field in required_fields):
            return jsonify({
                "error": "Отсутствуют обязательные поля",
                "required_fields": required_fields
            }), 400

        # Парсинг даты и времени
        try:
            booking_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            start_time = datetime.strptime(data['start_time'], '%H:%M').time()
            end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        except ValueError as e:
            return jsonify({
                "error": "Неверный формат данных",
                "details": str(e),
                "expected_formats": {
                    "date": "YYYY-MM-DD",
                    "time": "HH:MM"
                }
            }), 422

        # Проверка времени
        if start_time >= end_time:
            return jsonify({
                "error": "Некорректный временной интервал"
            }), 422

        # Проверка существования комнаты
        room = Room.query.get(data['room_id'])
        if not room:
            return jsonify({"error": "Комната не найдена"}), 404

        # Проверка пересечений бронирований
        overlapping = Booking.query.filter(
            Booking.room_id == data['room_id'],
            Booking.date == booking_date,
            Booking.start_time < end_time,
            Booking.end_time > start_time
        ).first()

        if overlapping:
            return jsonify({
                "error": "Время уже занято",
                "details": f"Занято с {overlapping.start_time} до {overlapping.end_time}"
            }), 409

        # Создание брони
        booking = Booking(
            user_id=get_jwt_identity(),
            room_id=data['room_id'],
            date=booking_date,
            start_time=start_time,
            end_time=end_time,
            participants=data.get('participants', 1)
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({
            "message": "Бронирование создано",
            "booking_id": booking.id,
            "date": booking_date.strftime('%d.%m.%Y'),
            "time": f"{start_time.strftime('%H:%M')} - {end_time.strftime('%H:%M')}"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Ошибка сервера",
            "details": str(e)
        }), 500

# 1. Получить свои бронирования (или все, если роль C)
@booking_bp.route('/api/bookings', methods=['GET'])
@jwt_required()
def list_bookings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Параметры пагинации
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
    except ValueError:
        return jsonify({'error': 'Параметры page и per_page должны быть целыми числами'}), 400
    if page < 1 or per_page < 1:
        return jsonify({'error': 'page и per_page должны быть >= 1'}), 400

    # Базовый запрос в зависимости от роли
    base_q = Booking.query
    if user.role != 'C':
        base_q = base_q.filter_by(user_id=user_id)

    # Общее число записей
    total_items = base_q.count()

    # Выбираем именно нужную страницу
    bookings_page = base_q.order_by(Booking.date.desc(), Booking.start_time)\
                          .offset((page - 1) * per_page)\
                          .limit(per_page)\
                          .all()

    # Собираем словарь пользователей для имён
    user_ids = {b.user_id for b in bookings_page}
    users = User.query.filter(User.id.in_(user_ids)).all()
    names_map = {u.id: u.name for u in users}

    # Формируем ответный список
    items = []
    for b in bookings_page:
        items.append({
            'id': b.id,
            'room_id': b.room_id,
            'date': b.date.isoformat(),
            'start_time': b.start_time.isoformat(),
            'end_time': b.end_time.isoformat(),
            'participants': b.participants,
            'created_at': b.created_at.isoformat(),
            'user_id': b.user_id,
            'user_name': names_map.get(b.user_id, '—')
        })

    total_pages = (total_items + per_page - 1) // per_page

    return jsonify({
        'page': page,
        'per_page': per_page,
        'total_items': total_items,
        'total_pages': total_pages,
        'items': items
    })



# 2. Отменить (удалить) бронирование
@booking_bp.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Бронирование не найдено'}), 404

    # Проверяем право удалять
    if user.role == 'C' or (user.role == 'B' and booking.user_id == user_id):
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Бронирование отменено'}), 200
    else:
        return jsonify({'error': 'Нет прав для отмены'}), 403

@booking_bp.route('/api/rooms/<int:room_id>/availability', methods=['GET'])
def get_availability(room_id):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'Параметр date обязателен'}), 400

    try:
        booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Неверный формат даты (ожидается YYYY-MM-DD)'}), 400

    # Проверка существования комнаты
    if not Room.query.get(room_id):
        return jsonify({'error': 'Комната не найдена'}), 404

    # Получаем занятые слоты
    booked_slots = Booking.query.filter(
        Booking.room_id == room_id,
        Booking.date == booking_date
    ).all()

    return jsonify({
        'room_id': room_id,
        'date': date_str,
        'booked_slots': [
            {
                'start': slot.start_time.strftime('%H:%M'),
                'end': slot.end_time.strftime('%H:%M')
            } for slot in booked_slots
        ]
    })

@main_bp.route('/api/analytics', methods=['GET'])
def analytics():
    # Получаем все комнаты
    rooms = Room.query.all()
    today = datetime.now().date()

    labels = []
    percents = []

    total_slots = 11  # количество возможных слотов (9–10, …, 19–20)

    for r in rooms:
        # Подсчитываем брони на сегодня по полю date
        bookings_today = Booking.query.filter_by(room_id=r.id, date=today).count()
        pct = bookings_today / total_slots * 100

        labels.append(r.name)
        percents.append(pct)

    # Рисуем график
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(labels, percents)
    ax.set_ylabel('Процент загрузки, %')
    ax.set_ylim(0, 100)
    ax.set_title(f'Загрузка переговорных за {today.strftime("%d.%m.%Y")}')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    # Отправляем PNG
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return send_file(buf, mimetype='image/png')

# Healthcheck
@main_bp.route('/api/healthcheck')
def healthcheck():
    return jsonify({'status': 'API работает'})