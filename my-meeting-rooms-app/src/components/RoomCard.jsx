import { Link } from 'react-router-dom'

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
      <img src={room.image} alt={room.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <Link to={`/rooms/${room.id}`} className="text-blue-600 hover:underline">Подробнее</Link>
      </div>
    </div>
  )
}