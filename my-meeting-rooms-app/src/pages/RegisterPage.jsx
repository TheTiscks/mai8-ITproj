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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Все поля обязательны для заполнения");
      return false;
    }

    if (form.password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirm_password: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при регистрации");
      }

      setSuccessMessage("Регистрация прошла успешно!");
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Произошла ошибка. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-2xl font-bold mb-6">LivnyOffice</div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Регистрация</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ваше имя"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Уже зарегистрированы?{' '}
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={() => navigate('/login')}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}