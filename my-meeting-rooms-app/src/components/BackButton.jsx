import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">
      ← Назад
    </button>
  )
}