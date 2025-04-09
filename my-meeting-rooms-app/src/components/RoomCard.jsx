import { Link } from "react-router-dom"

const RoomCard = ({ room }) => {
  return (
    <div className="border rounded-xl shadow-md p-4">
      <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-xl font-bold mt-2">{room.name}</h2>
      <p>Вместимость: {room.capacity} человек</p>
      <p>Оснащение: {room.amenities}</p>
      <Link
        to={`/room/${room.id}`}
        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Подробнее
      </Link>
    </div>
  )
}

export default RoomCard
