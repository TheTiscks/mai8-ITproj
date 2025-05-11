import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // роль (A, B или C)
  const role = user?.role?.toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-900 shadow p-4 flex justify-between items-center z-50">
      <div className="text-xl font-bold text-white">
        <Link to="/">LivnyOffice</Link>
      </div>

      <nav className="relative">
        {user ? (
          <div className="flex items-center space-x-4">
            {/* Показываем «Мои бронирования» только для B и C */}
            {(role === 'B' || role === 'C') && (
              <Link to="/my-bookings" className="text-white hover:underline">
                Мои бронирования
              </Link>
            )}

            <div className="relative">
              <button
                className="text-white hover:underline focus:outline-none"
                onClick={() => setShowMenu(v => !v)}
              >
                {user.name}
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10 min-w-[150px]">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
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
      </nav>
    </header>
);
}
