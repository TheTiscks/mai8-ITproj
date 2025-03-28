import os

class Config:
    # configuration file
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key") # для подписи сессий и CSRF-токенов

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///database.db") # URI для подключения к базе данных (по умолчанию SQLite)
    # DATABASE.DB IN ROOT PRJ FOLDER IS USED DATABASE!

    SQLALCHEMY_TRACK_MODIFICATIONS = False # disable flask-sqlalchemy notifications
