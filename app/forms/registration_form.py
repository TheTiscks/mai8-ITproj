from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from app.models.user import User  # Импорт модели User из текущей структуры

class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired("Обязательное поле"),
        Email("Некорректный email")
    ], render_kw={"placeholder": "example@mail.com"})

    password = PasswordField('Пароль', validators=[
        DataRequired("Обязательное поле"),
        Length(min=8, message="Минимум 8 символов"),
        EqualTo('confirm_password', message="Пароли не совпадают")
    ], render_kw={"placeholder": "••••••••"})

    confirm_password = PasswordField('Подтвердите пароль',
        render_kw={"placeholder": "••••••••"})

    submit = SubmitField('Зарегистрироваться')

    # Проверка уникальности email через запрос к БД
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email уже зарегистрирован')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired("Обязательное поле"),
        Email("Некорректный email")
    ], render_kw={"placeholder": "example@mail.com"})

    password = PasswordField('Пароль', validators=[
        DataRequired("Обязательное поле")
    ], render_kw={"placeholder": "••••••••"})

    submit = SubmitField('Войти') # Мы, русские, не обманываем друг друга и пишем по-русски
    #коммент абоба
    #ещё коммент