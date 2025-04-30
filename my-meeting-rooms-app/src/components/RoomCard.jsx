import { Link } from 'react-router-dom';

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-2 overflow-hidden">
      {room.image
        ? <img src={room.image} alt={room.name} className="w-full h-40 object-cover" />
        : <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Нет фото</span>
          </div>
      }
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <Link
          to={`/rooms/${room.id}`}
          className="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
