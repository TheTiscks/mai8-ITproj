import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MeetingRooms from './components/MeetingRooms';
import RoomDetails from './components/RoomDetails';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<MeetingRooms />} />
        <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
    </div>
  );
};

export default App;