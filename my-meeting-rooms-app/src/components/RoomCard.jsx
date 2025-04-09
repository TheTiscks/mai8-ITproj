// src/components/RoomCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="room-card p-4 border rounded-xl shadow-md bg-white transition transform hover:-translate-y-1">
      <img
        src={room.image ? room.image : "https://via.placeholder.com/400x200"}
        alt={room.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
      <p className="text-gray-700 mb-2">{room.description || "Нет описания"}</p>
      <p className="text-gray-500 mb-4">Вместимость: {room.capacity} человек</p>
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
