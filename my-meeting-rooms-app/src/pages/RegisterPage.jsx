import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
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
    if (form.password !== form.confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    // Здесь можно добавить логику отправки данных формы
    alert("Регистрация прошла успешно!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-2xl font-bold mb-6">LivnyOffice</div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Регистрация</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Имя"
            className="border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Введите пароль ещё раз"
            className="border p-2 rounded"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Зарегистрироваться
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Уже зарегистрированы?{' '}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate('/login')}
          >
            Войти
          </button>
        </div>
        <div className="mt-2 text-center">
          <button
            className="text-gray-500 hover:underline text-sm"
            onClick={() => navigate('/')}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}
