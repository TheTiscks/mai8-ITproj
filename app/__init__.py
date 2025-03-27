from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from app.models.user import User
from app.models.room import Room
from app.models.booking import Booking
import os   # just in case

# Python 3.13   Flask 3.1.0

# Инициализируем расширения
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)   # создание экземпляра Flask-приложения
    db.init_app(app) # database initialisation

    @app.route("/")
    def home():
        return render_template("home.html")
    return app
