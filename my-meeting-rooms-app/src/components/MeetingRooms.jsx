import RoomCard from "./RoomCard"

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
]

const MeetingRooms = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Доступные переговорные</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}

export default MeetingRooms
