// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import SearchFilter from '../components/SearchFilter';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = ({ query, equipment, capacity }) => {
    let result = [...rooms];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q));
    }
    if (equipment) {
      const needed = equipment.toLowerCase().split(',').map(s => s.trim());
      result = result.filter(r =>
        needed.every(e => r.equipment.toLowerCase().includes(e))
      );
    }
    if (capacity) {
      const cap = parseInt(capacity, 10);
      if (!isNaN(cap)) {
        result = result.filter(r => r.capacity >= cap);
      }
    }

    setFiltered(result);
  };

  return (
    <>
      <Header />

      {/* Добавили отступ сверху, чтобы не перекрываться фиксированным Header */}
      <div className="pt-20">
        <SearchFilter onSearch={handleSearch} />

        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-12">
          {loading
            ? <div className="col-span-full text-center text-gray-600">Загрузка...</div>
            : filtered.length
              ? filtered.map(room => <RoomCard key={room.id} room={room} />)
              : <div className="col-span-full text-center text-gray-600">Ничего не найдено</div>
          }
        </div>
      </div>
    </>
  );
}
