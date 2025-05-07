import React, { useState } from 'react';
import { FaFilter, FaSearch, FaChevronDown } from 'react-icons/fa';

export default function SearchFilter({ onSearch }) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [equipment, setEquipment] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleApply = () => {
    onSearch({ query, equipment, capacity });
    setShowFilters(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-6 flex items-center">
      {/* Поиск */}
      <div className="flex-1 flex items-center bg-white rounded-full shadow px-4 py-2">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Поиск переговорных..."
          className="flex-1 outline-none"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch({ query, equipment, capacity })}
        />
      </div>

      {/* Фильтры */}
      <button
        className="ml-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        onClick={() => setShowFilters(f => !f)}
      >
        <FaFilter className="mr-2" />
        Фильтры
        <FaChevronDown className="ml-2 text-sm" />
      </button>

      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
          {/* Оборудование */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Оборудование</label>
            <input
              type="text"
              placeholder="Wi-Fi, Проектор..."
              className="w-full border px-2 py-1 rounded"
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
            />
          </div>
          {/* Вместимость */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Мин. вместимость</label>
            <input
              type="number"
              placeholder="Человек"
              className="w-full border px-2 py-1 rounded"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={handleApply}
          >
            Применить
          </button>
        </div>
      )}
    </div>
  );
}
