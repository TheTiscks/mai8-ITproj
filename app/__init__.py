from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
#from app.models.user import User
import os   # just in case

# Python 3.13   Flask 3.1.0

# Инициализируем расширения
db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'

def create_app():
    app = Flask(__name__, template_folder="templates")  # создание экземпляра Flask-приложения
    app.config.from_object("config.Config")
    db.init_app(app) # database initialisation
    login_manager.init_app(app)
    from app.models.user import User
    from app.models.room import Room
    from app.models.booking import Booking
    from app.routes import auth_bp, main_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    @app.route("/")
    def home():
        return render_template("home.html")
    return app

@login_manager.user_loader
def load_user(user_id):
    from app.models.user import User
    return User.query.get(int(user_id))
