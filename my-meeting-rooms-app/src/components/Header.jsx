import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">LivnyOffice</div>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded">Регистрация</Link>
      </div>
    </header>
  )
}