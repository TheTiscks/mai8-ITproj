import React from "react";
import RoomCard from "./RoomCard";

const sampleRooms = [
  {
    id: 1,
    name: "Переговорная 1",
    description: "Уютная комната для обсуждения проектов.",
    capacity: 10,
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 2,
    name: "Переговорная 2",
    description: "Большая переговорная с оборудованием для видеоконференций.",
    capacity: 20,
    image: "", // Если нет картинки, будет использован placeholder
  },
  {
    id: 3,
    name: "Переговорная 3",
    description: "Небольшая и комфортная, идеально подходит для встреч.",
    capacity: 5,
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 4,
    name: "Переговорная 4",
    description: "Современная переговорная с отличной акустикой.",
    capacity: 15,
    image: "https://via.placeholder.com/400x200",
  },
];

const MeetingRooms = () => {
  return (
    <div className="container mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Доступные переговорные
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default MeetingRooms;
