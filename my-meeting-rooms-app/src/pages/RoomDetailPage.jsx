import { useParams, useNavigate } from 'react-router-dom';

const roomData = {
  1: { name: 'Переговорная 1', description: 'Уютная комната для обсуждения проектов.', image: '/room1.jpg' },
  2: { name: 'Переговорная 2', description: 'Большая переговорная для корпоративных встреч.', image: '/room2.jpg' },
  3: { name: 'Переговорная 3', description: 'Компактная и функциональная комната для небольших команд.', image: '/room3.jpg' },
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomData[id];

  if (!room) return <div className="p-6 text-center">Комната не найдена.</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <img src={room.image} alt={room.name} className="w-full h-60 object-cover rounded-xl mb-4" />
      <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
      <p className="text-gray-700 mb-4">{room.description}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">Назад</button>
    </div>
  );
}