# app/routes/api.py
from flask import request, jsonify
from app import db
from app.models.user import User
from werkzeug.security import generate_password_hash


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