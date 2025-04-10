import React from "react";
import { useNavigate } from "react-router-dom";
import "./roomCard.css"; // Дополнительные стили для карточек (если нужны)

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    // Здесь можно реализовать переход на отдельную страницу комнаты,
    // например: navigate(`/room/${room.id}`)
    alert(`Переход к перег. комнате "${room.name}"`);
  };

  return (
    <div className="room-card p-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all">
      <img
        src={room.image ? room.image : "https://via.placeholder.com/400x200"}
        alt={room.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{room.name}</h3>
      <p className="text-gray-600 mb-4">{room.description || "Нет описания"}</p>
      <button
        onClick={handleDetails}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Подробнее
      </button>
    </div>
  );
};

export default RoomCard;
