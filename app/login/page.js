'use client';

import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await pb.collection('users').authWithPassword(email, password);
      router.push('/');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Iniciar sesión</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg text-gray-900 placeholder-gray-400 bg-white"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg text-gray-900 placeholder-gray-400 bg-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Entrar
          </button>
          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
