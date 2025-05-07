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
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setBookings(bs => bs.filter(b => b.id !== id));
        } else {
          return res.json().then(j => Promise.reject(j.error));
        }
      })
      .catch(err => alert(err || 'Не удалось отменить'));
  };

  return (
    <>
      <Header />
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
        {loading && <p>Загрузка…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !bookings.length && <p>Нет активных бронирований</p>}
        <ul className="space-y-4">
          {bookings.map(b => (
            <li key={b.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p>Комната: #{b.room_id}</p>
                <p>С: {new Date(b.start_time).toLocaleString()}</p>
                <p>До: {new Date(b.end_time).toLocaleString()}</p>
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
