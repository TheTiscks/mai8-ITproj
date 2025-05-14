import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Header from '../components/Header';

export default function MyBookingsPage() {
  const { user } = useUser();

  // данные и состояния
  const [bookings, setBookings] = useState([]);
  const [roomsMap, setRoomsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  // нормализуем роль
  const role = user && user.role
    ? String(user.role).trim().toUpperCase()
    : '';

  // Функция загрузки страницы бронирований
  const fetchBookings = () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    fetch(
      `http://localhost:5000/api/bookings?page=${currentPage}&per_page=${bookingsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(async data => {
        if (data.error) {
          throw new Error(data.error);
        }
        // items — массив бронирований
        setBookings(data.items || []);
        setTotalPages(data.total_pages || 1);

        // подгрузим комнаты
        const roomIds = [...new Set((data.items || []).map(b => b.room_id))];
        const rooms = await Promise.all(
          roomIds.map(id =>
            fetch(`http://localhost:5000/api/rooms/${id}`)
              .then(r => r.json())
              .catch(() => ({ id, name: `#${id}` }))
          )
        );
        const map = {};
        rooms.forEach(r => { map[r.id] = r; });
        setRoomsMap(map);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Ошибка при загрузке бронирований');
      })
      .finally(() => setLoading(false));
  };

  // при монтировании и при смене страницы — перезагружаем
  useEffect(fetchBookings, [user, currentPage]);

  const handleCancel = id => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.ok) {
          // просто убираем из списка на клиенте
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
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const ALLOWED = ['B', 'C'];

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
          {bookings.map(b => {
            const room = roomsMap[b.room_id] || {};
            const canCancel = ALLOWED.includes(role) || b.user_id === user.id;
            return (
              <li
                key={b.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p><strong>Комната:</strong> {room.name || `#${b.room_id}`}</p>
                  {role === 'C' && <p><strong>Кто:</strong> {b.user_name}</p>}
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
            {/* Предыдущая */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ‹
            </button>

            {/* Номера */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  num === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}

            {/* Следующая */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}
