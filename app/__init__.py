from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

import os   # just in case

# Python 3.13   Flask 3.1.0

# Инициализируем расширения
db = SQLAlchemy()

def create_app():
    app = Flask(__name__, template_folder="templates")  # создание экземпляра Flask-приложения
    app.config.from_object("config.Config")
    db.init_app(app) # database initialisation
    from app.models.user import User
    from app.models.room import Room
    from app.models.booking import Booking

    @app.route("/")
    def home():
        return render_template("home.html")
    return app
