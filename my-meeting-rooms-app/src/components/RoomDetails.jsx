// src/components/RoomDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Для примера используем статические данные
  const room = {
    id,
    name: `Переговорная ${id}`,
    description:
      "Подробное описание переговорной комнаты, включая оборудование, удобства и расположение.",
    capacity: 10,
    image: "https://via.placeholder.com/400x200",
  };

  const handleBooking = () => {
    alert("Бронирование прошло успешно!");
  };

  return (
    <div className="container mx-auto px-4">
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
      >
        ← Назад
      </button>
      <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-md">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-60 object-cover rounded-md mb-4"
        />
        <h2 className="text-3xl font-bold mb-2">{room.name}</h2>
        <p className="mb-2">{room.description}</p>
        <p className="text-gray-500 mb-4">Вместимость: {room.capacity} человек</p>
        <button
          onClick={handleBooking}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-4"
        >
          Забронировать
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
