import { useParams, useNavigate } from 'react-router-dom'

const roomData = {
  1: { name: 'Переговорная А', image: 'https://via.placeholder.com/600x300', description: 'Светлая комната на 6 человек с окном и экраном.' },
  2: { name: 'Переговорная B', image: 'https://via.placeholder.com/600x300', description: 'Уютная комната с доской, проектором и кондиционером.' },
}

export default function RoomPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const room = roomData[id]

  if (!room) return <div className="text-center mt-10">Комната не найдена</div>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <img src={room.image} alt={room.name} className="rounded mb-6 w-full" />
      <h2 className="text-2xl font-bold mb-4">{room.name}</h2>
      <p className="text-gray-700 mb-6">{room.description}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Назад</button>
    </div>
  )
}
