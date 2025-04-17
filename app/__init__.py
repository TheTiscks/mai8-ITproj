from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os

# Инициализация расширений
db = SQLAlchemy()
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Конфигурация
    app.config.from_object("config.Config")
    app.config.update({
        'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'super-secret-key'),
        'JWT_ACCESS_TOKEN_EXPIRES': False,
        'SQLALCHEMY_TRACK_MODIFICATIONS': False
    })

    # Настройка CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Инициализация расширений
    db.init_app(app)
    migrate = Migrate(app, db)
    login_manager.init_app(app)
    jwt.init_app(app)

    # Импорт моделей и создание таблиц
    with app.app_context():
        from app.models.user import User
        from app.models.room import Room
        from app.models.booking import Booking
        db.create_all()

    # Регистрация blueprints
    from app.routes import auth_bp, main_bp, booking_bp, room_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(room_bp)

    # Обработчики ошибок
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    # Загрузчик пользователя
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app