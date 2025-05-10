'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import pb from '../lib/pocketbase';

export default function Header({ searchTerm, setSearchTerm }) {
  const [completed, setCompleted] = useState(null);
  const [inProgress, setInProgress] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = pb.authStore.model;

      if (!pb.authStore.isValid || !user) return;

      clearInterval(interval); // Detener el chequeo una vez tengamos sesión

      pb.collection('inscriptions')
        .getFullList({
          filter: `user = "${user.id}"`,
        })
        .then((records) => {
          const completedCount = records.filter(r => r.progress === 100).length;
          const inProgressCount = records.filter(r => r.progress < 100).length;

          setCompleted(completedCount);
          setInProgress(inProgressCount);
        })
        .catch((err) => {
          console.error('Error al obtener inscripciones:', err);
        });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_640px)_1fr] gap-6 w-full items-start mb-12">
      {/* Izquierda: saludo + imagen */}
      <div className="bg-[#F5F5F7] rounded-2xl flex justify-between items-center px-8 py-6 shadow-sm h-[180px]">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-black mb-2">
            Hello Josh!
          </h2>
          <p className="text-sm lg:text-base text-gray-600">
            It’s good to see you again.
          </p>
        </div>
        <div className="w-[160px] lg:w-[185px] h-auto -mt-4 lg:-translate-x-12 hidden sm:block">
          <Image
            src="/hello-josh.png"
            alt="Hello Josh"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Derecha: búsqueda + iconos + estadísticas */}
      <div className="flex flex-col gap-4 w-full">
        {/* Búsqueda e iconos */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full h-[48px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-10 pr-4 rounded-lg bg-[#F5F5F7] text-sm placeholder-gray-500"
            />
            <Image
              src="/search-icon.png"
              alt="Search"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/notification-icon.png"
                alt="Notifications"
                width={24}
                height={24}
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-[14px] h-[14px] flex items-center justify-center leading-none">
                1
              </span>
            </div>
            <Image
              src="/profile.jpg"
              alt="Profile"
              width={36}
              height={36}
              className="rounded-md object-cover"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 w-full h-[112px]">
          <div className="bg-[#F5F5F7] rounded-2xl flex flex-col justify-center items-center shadow-sm">
            <h3 className="text-3xl font-extrabold text-black leading-none">
              {completed !== null ? completed : '...'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Courses completed</p>
          </div>
          <div className="bg-[#F5F5F7] rounded-2xl flex flex-col justify-center items-center shadow-sm">
            <h3 className="text-3xl font-extrabold text-black leading-none">
              {inProgress !== null ? inProgress : '...'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Courses in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
