import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-900 shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">LivnyOffice</div>
      <div className="space-x-4">
        <Link to="/login" className="text-white hover:underline">
          Войти
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Регистрация
        </Link>
      </div>
    </header>
  );
}
