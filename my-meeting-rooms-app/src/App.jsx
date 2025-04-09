import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MeetingRooms from './components/MeetingRooms';
import RoomDetails from './components/RoomDetails';

const App = () => {
  return (
    <Router>  {/* Оборачиваем все роуты в Router */}
      <Routes>
        <Route path="/" element={<MeetingRooms />} />
        <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
