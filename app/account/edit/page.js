'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';

export default function EditProfilePage() {
  const user = pb.authStore.model;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await pb.collection('users').update(user.id, formData);
      setSuccess('Perfil actualizado con éxito ✅');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al actualizar el perfil.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
          Editar perfil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 sm:p-4 border rounded-xl text-gray-900 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 border rounded-xl text-gray-900 text-sm sm:text-base"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 sm:p-4 border rounded-xl text-gray-900 text-sm sm:text-base"
          />
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Foto de perfil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full p-2 sm:p-3 border rounded-xl text-gray-900 text-sm sm:text-base"
            />
          </div>
          {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
          {success && <p className="text-green-600 text-sm sm:text-base">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
