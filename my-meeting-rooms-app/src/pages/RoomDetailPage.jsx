import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import BookingModal from "../components/BookingModal";

export default function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const roomData = {
    1: {
      name: 'Переговорная А',
      image: 'https://via.placeholder.com/600x300',
      description: 'Светлая комната с окном и экраном.',
      capacity: 6,
    },
    2: {
      name: 'Переговорная B',
      image: 'https://via.placeholder.com/600x300',
      description: 'Уютная комната с доской, проектором и кондиционером.',
      capacity: 10,
    },
  };

  const room = roomData[id];

  if (!room) {
    return <div className="text-center mt-10">Комната не найдена</div>;
  }

  const handleBookingConfirm = (slot) => {
    alert(`Вы забронировали ${room.name} на ${slot}`);
    setShowBookingModal(false);
    // Здесь можно добавить вызов API для сохранения бронирования
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-6 mt-24 bg-white rounded-xl shadow-md">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-60 object-cover rounded-md mb-4"
        />
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{room.name}</h2>
        <p className="mb-2 text-gray-700">{room.description}</p>
        <p className="text-gray-500 mb-4">Вместимость: {room.capacity} человек</p>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Назад
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Забронировать
          </button>
        </div>
      </div>
      {showBookingModal && (
        <BookingModal
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </>
  );
}
