import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <input type="password" placeholder="Пароль" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Войти</button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <Link to="/register" className="text-blue-600 underline block">Ещё не зарегистрировались?</Link>
        <button onClick={() => navigate('/')} className="text-gray-600 underline">Назад</button>
      </div>
    </div>
  );
}
