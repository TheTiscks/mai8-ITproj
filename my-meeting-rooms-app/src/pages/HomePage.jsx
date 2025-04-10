import { Link } from 'react-router-dom';

const rooms = [
  { id: 1, name: 'Переговорная 1', description: 'Уютная комната для обсуждения проектов. Имеется современное оборудование.', image: '/room1.jpg' },
  { id: 2, name: 'Переговорная 2', description: 'Большая переговорная для корпоративных встреч.', image: '/room2.jpg' },
  { id: 3, name: 'Переговорная 3', description: 'Компактная и функциональная комната для небольших команд.', image: '/room3.jpg' }
];

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">LLivnyOffice</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Регистрация</Link>
        </div>
      </div>
      <h2 className="text-center text-3xl font-bold mb-8">Наши переговорные</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <Link to={`/room/${room.id}`} key={room.id} className="border rounded-xl shadow hover:shadow-md transition overflow-hidden">
            <img src={room.image} alt={room.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <p className="text-sm text-gray-600">{room.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/register" className="text-blue-600 underline">Ещё не зарегистрировались?</Link>
      </div>
    </div>
  );
}