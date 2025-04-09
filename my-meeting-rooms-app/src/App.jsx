import React from "react";
import { Routes, Route } from "react-router-dom";
import MeetingRooms from "./components/MeetingRooms";
import RoomDetails from "./components/RoomDetails";

function App() {
  return (
    <div>
      {/* Фиксированная шапка */}
      <header className="fixed top-0 left-0 w-full bg-blue-900 text-white py-4 shadow-md z-10">
        <h1 className="text-center text-2xl font-bold">
          Бронирование переговорных комнат
        </h1>
      </header>

      {/* Основной контент с отступом сверху */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<MeetingRooms />} />
          <Route path="/room/:id" element={<RoomDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
