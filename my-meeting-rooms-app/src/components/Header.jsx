import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-900 text-white py-4 shadow-md z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Логотип и название */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
            <span className="text-blue-900 font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold">LivnyOffice</span>
        </div>
        {/* Кнопка регистрации */}
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded font-medium"
        >
          Регистрация
        </button>
      </div>
    </header>
  );
};

export default Header;
