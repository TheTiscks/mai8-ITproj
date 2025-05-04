import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookingModal from "../components/BookingModal";
import { UserContext } from "../UserContext";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        if (!response.ok) throw new Error("Room not found");
        setRoom(await response.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!room) return <div>Комната не найдена</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header />

      <div className="mt-24 bg-white rounded-lg shadow-md overflow-hidden">
        {room.image && (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{room.name}</h1>
          <p className="text-gray-700 mb-4">{room.equipment}</p>
          <p className="text-gray-600 mb-6">Вместимость: {room.capacity} чел.</p>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline"
            >
              Назад
            </button>

            {user ? (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Забронировать
              </button>
            ) : (
              <p className="text-gray-600">
                Для бронирования необходимо войти в систему
              </p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <BookingModal
          roomId={room.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}