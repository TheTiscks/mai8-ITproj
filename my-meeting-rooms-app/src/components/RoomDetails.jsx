import { useParams, useNavigate } from "react-router-dom"

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const room = {
    id,
    name: `Переговорная ${id}`,
    capacity: 10,
    amenities: "Проектор, Wi-Fi",
    image: "https://via.placeholder.com/400x200",
    description: "Уютная переговорная комната для встреч и презентаций."
  }

  const handleBooking = () => {
    alert("Переговорная успешно забронирована!")
    navigate("/")
  }

  return (
    <div className="max-w-xl mx-auto">
      <img src={room.image} alt={room.name} className="w-full h-60 object-cover rounded-md mb-4" />
      <h2 className="text-3xl font-bold mb-2">{room.name}</h2>
      <p className="mb-2">{room.description}</p>
      <p className="mb-1">Вместимость: {room.capacity} человек</p>
      <p className="mb-4">Оснащение: {room.amenities}</p>
      <button
        onClick={handleBooking}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Забронировать
      </button>
    </div>
  )
}

export default RoomDetails
