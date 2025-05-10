'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';

export default function MyCourses() {
  const [inscriptions, setInscriptions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🧠 Usuario actual:', pb.authStore.model);
    async function fetchInscriptions() {
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) {
          console.warn('⚠️ Usuario no autenticado');
          return;
        }

        const records = await pb.collection('inscriptions').getFullList({
          filter: `user = "${userId}"`,
          expand: 'course',
        });

        if (!Array.isArray(records)) {
          throw new Error('La respuesta no es una lista');
        }

        setInscriptions(records);
        console.log('✅ Inscriptions cargadas:', records);
      } catch (err) {
        console.error('❌ Error al cargar inscriptions:', {
          message: err.message,
          status: err.status,
          response: err.response,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInscriptions();
  }, []);

  const handleUnsubscribe = async (inscriptionId) => {
    const confirm = window.confirm('¿Cancelar inscripción?');
    if (!confirm) return;

    try {
      await pb.collection('inscriptions').delete(inscriptionId);
      setInscriptions(prev => prev.filter(i => i.id !== inscriptionId));
      setCurrentIndex(0);
    } catch (err) {
      console.error('❌ Error al cancelar inscripción:', {
        message: err.message,
        status: err.status,
        response: err.response,
      });
      alert('No se pudo cancelar la inscripción.');
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + inscriptions.length) % inscriptions.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % inscriptions.length);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando cursos inscritos...</p>;
  }

  if (inscriptions.length === 0) {
    return <p className="text-sm text-gray-500">Aún no estás inscrito en ningún curso.</p>;
  }

  const current = inscriptions[currentIndex];
  const course = current.expand?.course;
  const progress = current.progress ?? 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <div className="bg-[#F5F5F7] rounded-2xl w-full px-5 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Info del curso */}
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-[3px]">
            <img
              src={course?.icon ? pb.files.getURL(course, course.icon) : '/placeholder.png'}
              alt="Course icon"
              className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-black">
              {course?.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              by {course?.author}
            </p>
          </div>
        </div>

        {/* Progreso + botón continuar */}
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11">
            <svg className="w-full h-full">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#000"
                strokeWidth="4"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-black leading-none">
              {progress}%
            </div>
          </div>

          <button
            onClick={() => router.push(`/courses/${course?.id}`)}
            className="bg-black text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>

        {/* Tiempo y rating */}
        <div className="hidden sm:flex gap-4 text-xs text-gray-700">
          <span className="flex items-center gap-1.5">
            <img src="/clock.png" alt="clock" className="w-4 h-4" />
            {course?.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <img src="/fire.png" alt="fire" className="w-4 h-4" />
            {course?.rating}
          </span>
        </div>

        {/* Botón cancelar */}
        <button
          onClick={() => handleUnsubscribe(current.id)}
          className="bg-red-600 text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold hover:bg-red-700 transition"
        >
          Cancelar
        </button>
      </div>

      {/* Flechas */}
      {inscriptions.length > 1 && (
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black flex items-center justify-center hover:bg-gray-200 transition"
          >
            <img src="/arrow-left.png" alt="Left" className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black flex items-center justify-center hover:bg-gray-200 transition"
          >
            <img src="/arrow-right.png" alt="Right" className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
