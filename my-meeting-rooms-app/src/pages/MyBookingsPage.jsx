// src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Header from '../components/Header';

export default function MyBookingsPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        const data = await res.json();
        // если сервер вернул объект вида { bookings: [...] }, возьмём data.bookings
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.bookings)
            ? data.bookings
            : [];
        setBookings(list);
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
          {bookings.map(b => (
            <li key={b.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p><strong>Комната:</strong> #{b.room_id}</p>
                <p><strong>С:</strong> {new Date(b.start_time).toLocaleString()}</p>
                <p><strong>До:</strong> {new Date(b.end_time).toLocaleString()}</p>
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
          ))}
        </ul>
      </div>
    </>
  );
}
