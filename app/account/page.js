'use client';

import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      // Obtenemos el usuario actual desde el authStore
      const userId = pb.authStore.model.id;

      // Buscamos el usuario en la colección para obtener su email real
      const userRecord = await pb.collection('users').getOne(userId);

      // Verificamos la contraseña actual usando el email real
      await pb.collection('users').authWithPassword(
        userRecord.email,
        oldPassword
      );

      // Cambiamos la contraseña
      await pb.collection('users').update(userId, {
        password: newPassword,
        passwordConfirm: confirmPassword,
      });

      setSuccess('Contraseña cambiada con éxito.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError('La contraseña actual es incorrecta o hubo un problema.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Cambiar contraseña
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border rounded-xl text-gray-900"
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-xl text-gray-900"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-xl text-gray-900"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
