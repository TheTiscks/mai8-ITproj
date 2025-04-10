import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import RegistrationForm from "./components/RegistrationForm";
import RoomDetails from "./components/RoomDetails";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/room/:id" element={<RoomDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
