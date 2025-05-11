// src/pages/AnalyticsPage.jsx
import React from 'react';
import Header from '../components/Header';

export default function AnalyticsPage() {
  return (
    <>
      <Header />
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Аналитика загрузки переговорных</h1>
        <img
          src="http://localhost:5000/api/analytics"
          alt="Загрузка переговорных"
          className="w-full rounded shadow"
        />
      </div>
    </>
  );
}
