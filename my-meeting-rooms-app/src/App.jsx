import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomCard from "./components/RoomCard";
import BackButton from "./components/BackButton";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
