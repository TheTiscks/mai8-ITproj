import React from 'react';
import { useParams } from 'react-router-dom';

const sampleRooms = [
  {
    id: 1,
    name: "Переговорная 1",
    capacity: 10,
    amenities: "Проектор, Wi-Fi",
    image: "https://via.placeholder.com/400x200"
  },
  {
    id: 2,
    name: "Переговорная 2",
    capacity: 8,
    amenities: "Конференц-связь, доска",
    image: "https://via.placeholder.com/400x200"
  },
  {
    id: 3,
    name: "Переговорная 3",
    capacity: 12,
    amenities: "Телевизор, Wi-Fi",
    image: "https://via.placeholder.com/400x200"
  },
  {
    id: 4,
    name: "Переговорная 4",
    capacity: 5,
    amenities: "Доска, телефон",
    image: "https://via.placeholder.com/400x200"
  }
];

const RoomDetails = () => {
  const { id } = useParams();
  const room = sampleRooms.find(r => r.id === parseInt(id));

  if (!room) return <div>Комната не найдена</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{room.name}</h1>
      <img src={room.image} alt={room.name} className="w-full max-w-xl mb-4" />
      <p><strong>Вместимость:</strong> {room.capacity}</p>
      <p><strong>Оснащение:</strong> {room.amenities}</p>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Забронировать
      </button>
    </div>
  );
};

export default RoomDetails;