import React, { useState } from 'react';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь отправьте данные на бэкенд
    console.log({ email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4">Регистрация</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">Email</label>
        <input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com" 
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">Пароль</label>
        <input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-1">Подтвердите пароль</label>
        <input 
          id="confirmPassword"
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••" 
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegistrationForm;
