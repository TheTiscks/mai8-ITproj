import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingModal({ onClose, onConfirm, bookedSlots = [] }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  // Генерируем все временные слоты с 09:00 до 20:00 (последний слот: 19:00–20:00)
  useEffect(() => {
    const allSlots = [];
    for (let hour = 9; hour < 20; hour++) {
      const start = hour.toString().padStart(2, "0") + ":00";
      const end = (hour + 1).toString().padStart(2, "0") + ":00";
      allSlots.push(`${start} - ${end}`);
    }
    // Фильтруем слоты, исключая те, что уже заняты
    const freeSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(freeSlots);
  }, [bookedSlots]);

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Пожалуйста, выберите временной слот!");
      return;
    }
    // Форматируем выбранную дату в строку (например, YYYY-MM-DD)
    const yyyy = selectedDate.getFullYear();
    const mm = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const dd = selectedDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Передаём выбранные дату и слот
    onConfirm({ date: formattedDate, slot: selectedSlot });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay с менее интенсивным затемнением (opacity 25%) */}
      <div
        className="absolute inset-0 bg-black opacity-25"
        onClick={onClose}
      ></div>
      {/* Модальное окно */}
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4 text-center">
          Выберите дату и временной слот
        </h3>
        {/* Выбор даты */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Дата бронирования</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        {/* Выбор временного слота */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Временной слот</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">Выберите время</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
