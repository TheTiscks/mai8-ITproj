import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Если хотите, можете убрать SERVER_NAME или оставить
    # SERVER_NAME = 'localhost:5000'

    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")

    # Указываем на файл в папке instance
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(basedir, 'instance', 'database.db')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")
