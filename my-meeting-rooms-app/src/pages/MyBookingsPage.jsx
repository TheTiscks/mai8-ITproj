// src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Header from '../components/Header';

export default function MyBookingsPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [roomsMap, setRoomsMap] = useState({}); // { [id]: { name, ... } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 1) Сначала загрузим список бронирований
    fetch('http://localhost:5000/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const list = Array.isArray(data) ? data : data.bookings || [];
        setBookings(list);

        // 2) Соберём уникальные room_id
        const roomIds = [...new Set(list.map(b => b.room_id))];
        // 3) Подгрузим по ним данные комнат
        const rooms = await Promise.all(
          roomIds.map(id =>
            fetch(`http://localhost:5000/api/rooms/${id}`)
              .then(r => r.json())
              .catch(() => ({ id, name: `#${id}` }))
          )
        );
        // 4) Сложим в map для быстрого доступа
        const map = {};
        rooms.forEach(r => { map[r.id] = r; });
        setRoomsMap(map);
      })
      .catch(err => {
        console.error(err);
        setError('Ошибка при загрузке бронирований');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
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

  return (
    <>
      <Header />
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>

        {loading && <p>Загрузка…</p>}
        {error   && <p className="text-red-500">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p>У вас пока нет бронирований.</p>
        )}

        <ul className="space-y-4">
          {bookings.map(b => {
            const room = roomsMap[b.room_id] || {};
            return (
              <li
                key={b.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p><strong>Комната:</strong> {room.name || `#${b.room_id}`}</p>
                  <p><strong>С:</strong> {formatDateTime(b.date, b.start_time)}</p>
                  <p><strong>До:</strong> {formatDateTime(b.date, b.end_time)}</p>
                </div>
                {(user.role === 'C' || b.user_id === user.id) && (
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
      </div>
    </>
  );
}
