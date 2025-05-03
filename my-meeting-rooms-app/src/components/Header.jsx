import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-900 shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">LivnyOffice</div>
      <div className="flex items-center gap-6">
        {/* Добавленная ссылка "Статистика" */}
        <Link 
          to="/occupancy" 
          className="text-white hover:text-blue-200 transition-colors"
        >
          Статистика
        </Link>
      <div className="relative">
        {user ? (
          <div className="relative">
            <button
              className="text-white hover:underline"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user.name}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
}
