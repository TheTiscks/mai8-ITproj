import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить валидацию и отправку данных
    alert("Регистрация прошла успешно!");
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 mt-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
