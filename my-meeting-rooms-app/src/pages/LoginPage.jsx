import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext"; // импорт вверху


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-2xl font-bold mb-6">LivnyOffice</div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Вход в систему</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
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