# app/__init__.py

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Инициализация расширений
db = SQLAlchemy()
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # Конфигурация
    app.config.from_object("config.Config")
    app.config.update({
        'JWT_VERIFY_SUB': False,
        'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'super-secret-key'),
        'JWT_ACCESS_TOKEN_EXPIRES': False,
        'SQLALCHEMY_TRACK_MODIFICATIONS': False
    })

    # CORS
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

    # Инициализация расширений
    db.init_app(app)
    Migrate(app, db)
    login_manager.init_app(app)
    jwt.init_app(app)

    # Создание таблиц
    with app.app_context():
        from app.models.user    import User
        from app.models.room    import Room
        from app.models.booking import Booking
        db.create_all()

    # Импортируем Blueprint’ы из единого файла routes.py
    from app.routes import auth_bp, main_bp, booking_bp, room_bp

    # Регистрируем их **без** url_prefix, потому что в routes.py указаны полные пути
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(room_bp)

    # Обработчики ошибок
    @app.errorhandler(400)
    def bad_request(err):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(404)
    def not_found(err):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(err):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    # Загрузчик пользователя Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app
