import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru"; // Импортируем русскую локаль
import "react-datepicker/dist/react-datepicker.css";

// Регистрируем русскую локаль
registerLocale("ru", ru);

export default function BookingModal({ onClose, onConfirm, bookedSlots = [] }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Генерируем все временные слоты с 09:00 до 20:00 (последний слот: 19:00–20:00)
  useEffect(() => {
    const allSlots = [];
    for (let hour = 9; hour < 20; hour++) {
      const start = hour.toString().padStart(2, "0") + ":00";
      const end = (hour + 1).toString().padStart(2, "0") + ":00";
      allSlots.push(`${start} - ${end}`);
    }
    // Фильтруем слоты, исключая занятые
    const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
    setAvailableSlots(freeSlots);
  }, [bookedSlots]);

  const handleInitialConfirm = () => {
    if (!selectedSlot) {
      setError("Пожалуйста, выберете временной слот!");
      return;
    }
    setError("");
    setShowConfirmation(true);
  };

  const handleContinue = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    // Форматируем дату в формат YYYY-MM-DD
    const yyyy = selectedDate.getFullYear();
    const mm = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const dd = selectedDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Передаём данные бронирования родителю
    onConfirm({ date: formattedDate, slot: selectedSlot });
    onClose();
  };

  // Функция для форматированного отображения даты в уведомлении успеха
  const formatDate = (date) => {
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay с умеренной непрозрачностью */}
      <div
        className="absolute inset-0 bg-black opacity-25"
        onClick={onClose}
      ></div>
      {/* Модальное окно */}
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-sm w-full">
        {!showConfirmation && !showSuccess && (
          <>
            <h3 className="text-xl font-bold mb-4 text-center">
              Выберите дату и временной слот
            </h3>
            {/* Выбор даты */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Дата бронирования
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                locale="ru" // Русская локаль, неделя начинается с понедельника
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            {/* Выбор временного слота */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Временной слот
              </label>
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
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="text-gray-600 hover:underline"
              >
                Отмена
              </button>
              <button
                onClick={handleInitialConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </>
        )}

        {showConfirmation && !showSuccess && (
          <>
            <h3 className="text-xl font-bold mb-4 text-center">
              Подтверждение бронирования
            </h3>
            <p className="text-center text-gray-700 mb-6">
              Вы хотите забронировать на {formatDate(selectedDate)} в {selectedSlot}?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-600 hover:underline"
              >
                Отмена
              </button>
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Продолжить
              </button>
            </div>
          </>
        )}

        {showSuccess && (
          <>
            <h3 className="text-xl font-bold mb-4 text-center">
              Бронь успешна!
            </h3>
            <p className="text-center text-gray-700 mb-6">
              Вы забронировали переговорную на {formatDate(selectedDate)} в {selectedSlot}.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleSuccessClose}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Отлично
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
