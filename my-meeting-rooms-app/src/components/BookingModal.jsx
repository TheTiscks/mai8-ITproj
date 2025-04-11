import React, { useState } from "react";

export default function BookingModal({ onClose, onConfirm }) {
  const [selectedSlot, setSelectedSlot] = useState("");

  // Генерируем временные слоты с 09:00 до 19:00, так что последний слот: 19:00–20:00.
  const slots = [];
  for (let hour = 9; hour < 20; hour++) {
    const start = hour.toString().padStart(2, "0") + ":00";
    const end = (hour + 1).toString().padStart(2, "0") + ":00";
    slots.push({ start, end });
  }

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot);
    } else {
      alert("Пожалуйста, выберите временной слот!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Фон затемнения */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Само модальное окно */}
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Выберите временной слот</h3>
        <select
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option value="">Выберите время</option>
          {slots.map((slot) => (
            <option key={slot.start} value={`${slot.start} - ${slot.end}`}>
              {slot.start} – {slot.end}
            </option>
          ))}
        </select>
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mb-2"
        >
          Подтвердить
        </button>
        <button
          onClick={onClose}
          className="w-full text-blue-600 hover:underline"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
