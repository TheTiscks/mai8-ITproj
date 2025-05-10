// src/pages/RoomDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import BookingModal from "../components/BookingModal";
import { useUser } from "../UserContext";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser(); // <-- хук вместо прямого контекста

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(err => console.error("Ошибка при загрузке комнаты:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Загрузка...</div>;
  }
  if (!room || room.error) {
    return <div className="text-center mt-20 text-red-600">Комната не найдена</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-6 mt-24 bg-white rounded-xl shadow-md">
        {room.image && (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-60 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="text-3xl font-bold mb-2">{room.name}</h2>
        <p className="text-gray-700 mb-2">{room.equipment}</p>
        <p className="text-gray-500 mb-4">Вместимость: {room.capacity} человек</p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Назад
          </button>
          {user ? (
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Забронировать
            </button>
          ) : (
            <p className="text-gray-600">
              Для бронирования необходимо{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                войти
              </Link>{" "}
              или{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                зарегистрироваться
              </Link>
            </p>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          roomId={room.id}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
}
