import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Header from '../components/Header';

export default function MyBookingsPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [roomsMap, setRoomsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // нормализуем роль
  const role = user && user.role
    ? String(user.role).trim().toUpperCase()
    : '';

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const list = Array.isArray(data) ? data : data.bookings || [];
        setBookings(list);

        const roomIds = [...new Set(list.map(b => b.room_id))];
        const rooms = await Promise.all(
          roomIds.map(id =>
            fetch(`http://localhost:5000/api/rooms/${id}`)
              .then(r => r.json())
              .catch(() => ({ id, name: `#${id}` }))
          )
        );

        const map = {};
        rooms.forEach(r => {
          map[r.id] = r;
        });
        setRoomsMap(map);
      })
      .catch(err => {
        console.error(err);
        setError('Ошибка при загрузке бронирований');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = id => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.ok) {
          setBookings(bs => bs.filter(b => b.id !== id));
        } else {
          const err = await res.json();
          alert(err.error || 'Не удалось отменить бронирование');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Не удалось отменить бронирование');
      });
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(date)) return `${dateStr} ${timeStr}`;
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // роли, которым разрешена отмена
  const ALLOWED = ['B', 'C'];

  // вычисляем страницы
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <>
      <Header />
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
        {loading && <p>Загрузка…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p>У вас пока нет бронирований.</p>
        )}

        <ul className="space-y-4">
          {currentBookings.map(b => {
            const room = roomsMap[b.room_id] || {};
            const canCancel = ALLOWED.includes(role) || b.user_id === user.id;
            return (
              <li
                key={b.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p><strong>Комната:</strong> {room.name || `#${b.room_id}`}</p>
                  {role === 'C' && (
                    <p><strong>Кто:</strong> {b.user_name}</p>
                  )}
                  <p><strong>С:</strong> {formatDateTime(b.date, b.start_time)}</p>
                  <p><strong>До:</strong> {formatDateTime(b.date, b.end_time)}</p>
                </div>
                {canCancel && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Отменить
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* Навигация по страницам */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            {/* Кнопка «предыдущая» */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              ‹
            </button>

            {/* Номера страниц */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${num === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {num}
              </button>
            ))}

            {/* Кнопка «следующая» */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}
