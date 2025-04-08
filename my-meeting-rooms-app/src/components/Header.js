import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Бронирование переговорных комнат</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <input 
            type="date" 
            className="px-2 py-1 rounded text-black" 
            aria-label="Выберите дату"
          />
          <input
            type="number"
            min="1"
            placeholder="Вместимость"
            className="px-2 py-1 rounded text-black"
            aria-label="Укажите вместимость"
          />
          <button
            className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100">
            Искать
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
