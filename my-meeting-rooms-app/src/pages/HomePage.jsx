import { useEffect, useState } from 'react';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке комнат:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center col-span-full">Загрузка...</div>
        ) : rooms.length > 0 ? (
          rooms.map(room => <RoomCard key={room.id} room={room} />)
        ) : (
          <div className="text-center col-span-full">Нет доступных переговорок</div>
        )}
      </div>
    </div>
  );
}
