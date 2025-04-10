import Header from '../components/Header'
import RoomCard from '../components/RoomCard'

const dummyRooms = [
  { id: 1, name: 'Переговорная А', description: 'Комната на 6 человек', image: '/room1.jpg' },
  { id: 2, name: 'Переговорная B', description: 'Комната на 10 человек', image: '/room2.jpg' },
]

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyRooms.map(room => <RoomCard key={room.id} room={room} />)}
      </div>
    </div>
  )
}