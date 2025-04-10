import React from "react";
import RoomCard from "./RoomCard";

const sampleRooms = [
  {
    id: 1,
    name: "Переговорная 1",
    description:
      "Уютная комната для обсуждения проектов. Имеется современное оборудование.",
    capacity: 10,
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 2,
    name: "Переговорная 2",
    description: "Большая переговорная для корпоративных встреч.",
    capacity: 20,
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 3,
    name: "Переговорная 3",
    description:
      "Компактная и функциональная комната для небольших команд.",
    capacity: 5,
    image: "",
  },
];

const MainPage = () => {
  return (
    <div className="container mx-auto px-4 mt-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Наши переговорные
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
