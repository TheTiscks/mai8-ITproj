import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

registerLocale("ru", ru);

export default function BookingModal({ onClose, roomId }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${roomId}/availability?date=${dateStr}`
        );

        const bookedSlots = response.data.booked_slots.map(
          slot => `${slot.start} - ${slot.end}`
        );

        const allSlots = [];
        for (let hour = 9; hour < 20; hour++) {
          const start = `${hour.toString().padStart(2, '0')}:00`;
          const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
          allSlots.push(`${start} - ${end}`);
        }

        setAvailableSlots(allSlots.filter(slot => !bookedSlots.includes(slot)));
      } catch (err) {
        console.error("Ошибка получения доступных слотов:", err);
        setError("Не удалось загрузить доступное время. Попробуйте позже.");
      }
    };

    fetchAvailability();
  }, [selectedDate, roomId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!selectedSlot) {
        throw new Error("Выберите временной слот");
      }

      const [startTime, endTime] = selectedSlot.split(" - ");

      // Валидация формата времени
      if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
        setError("Неверный формат времени. Используйте HH:MM");
        setLoading(false);
        return;
      }

      const dateStr = selectedDate.toISOString().split('T')[0];

      const payload = {
        room_id: parseInt(roomId),
        start_time: `${dateStr}T${startTime}:00+03:00`,
        end_time: `${dateStr}T${endTime}:00+03:00`,
        participants: parseInt(participants) || 1
      };

      console.log("Отправляемые данные:", payload);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      setShowSuccess(true);
    } catch (err) {
      let errorMsg = "Ошибка при бронировании";

      if (err.response) {
        console.error("Ошибка ответа сервера:", err.response.data);
        errorMsg = err.response.data?.error || errorMsg;
        if (err.response.data?.details) {
          errorMsg += `: ${err.response.data.details}`;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ru-RU", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-25" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-full max-w-md">
        {!showSuccess ? (
          <>
            <h2 className="text-xl font-bold mb-4">Бронирование переговорки</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Дата</label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                locale="ru"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Время</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedSlot}
                onChange={e => setSelectedSlot(e.target.value)}
                disabled={availableSlots.length === 0}
              >
                <option value="">Выберите время</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {availableSlots.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Нет доступных слотов на выбранную дату
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Количество участников
              </label>
              <input
                type="number"
                min="1"
                value={participants}
                onChange={e => setParticipants(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedSlot || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Сохранение..." : "Забронировать"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Бронирование подтверждено!</h2>
            <p className="mb-4">
              {formatDate(selectedDate)} с {selectedSlot}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Готово
            </button>
          </div>
        )}
      </div>
    </div>
  );
}