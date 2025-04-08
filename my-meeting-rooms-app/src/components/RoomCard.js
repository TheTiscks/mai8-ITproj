import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl shadow-md overflow-hidden">
      <img src={room.image} alt={room.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        <p>Вместимость: {room.capacity}</p>
        <p>Оснащение: {room.amenities}</p>
        <button
          onClick={() => navigate(`/room/${room.id}`)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default RoomCard;