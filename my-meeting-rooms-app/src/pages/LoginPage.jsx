import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Неверный email или пароль");
      }

      const data = await response.json();
      login(data.user, data.access_token); // Передаем пользователя и токен в контекст
      navigate("/"); // Перенаправляем на главную страницу
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-2xl font-bold mb-6">LivnyOffice</div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Вход в систему</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Войти
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Ещё не зарегистрировались?{' '}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate('/register')}
          >
            Зарегистрироваться
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