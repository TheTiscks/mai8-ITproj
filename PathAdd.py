# update_photo_paths.py
from app import create_app, db
from app.models.room import Room


def update_photo_paths():
    app = create_app()
    with app.app_context():
        # Получаем все комнаты из базы данных
        rooms = Room.query.order_by(Room.id).all()

        # Проверяем, что комнат не меньше 3
        if len(rooms) < 3:
            print("Ошибка: В базе данных меньше 3 комнат")
            return

        # Обновляем photo_path для первых трех комнат
        rooms[0].photo_path = "images/peregovor1.png"
        rooms[1].photo_path = "images/peregovor2.png"
        rooms[2].photo_path = "images/peregovor3.png"

        # Сохраняем изменения
        db.session.commit()
        print("Успешно обновлены photo_path для 3 комнат")


if __name__ == "__main__":
    update_photo_paths()