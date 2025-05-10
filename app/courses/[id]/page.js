'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import Link from 'next/link';

export default function CourseDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourse() {
      try {
        const record = await pb.collection('courses').getOne(id, {
          signal: controller.signal,
        });
        setCourse(record);
      } catch (err) {
        if (err?.isAbort || err?.message?.includes('autocancelled')) {
          console.log('ℹ️ Petición cancelada automáticamente.');
        } else {
          console.error('❌ Error cargando curso:', err);
          setCourse(null);
        }
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserId() {
      const user = pb.authStore.model;
      if (user) setUserId(user.id);
    }

    if (id) {
      fetchCourse();
      fetchUserId();
    }

    return () => controller.abort(); // limpiar si el componente se desmonta
  }, [id]);

  const handleEnroll = async () => {
    if (!userId) {
      alert('Debes iniciar sesión para inscribirte.');
      return router.push('/login');
    }

    try {
      const existing = await pb.collection('inscriptions').getFirstListItem(
        `user="${userId}" && course="${id}"`
      );

      if (existing) {
        alert('Ya estás inscrito en este curso.');
        return router.push('/');
      }
    } catch (err) {
      if (err?.status !== 404) {
        console.error('Error al verificar inscripción:', err);
        return alert('Error inesperado verificando inscripción');
      }
    }

    try {
      await pb.collection('inscriptions').create({
        user: userId,
        course: id,
        progress: 0,
      });
      alert('Te has inscrito correctamente.');
      router.push('/');
    } catch (err) {
      console.error('Error al inscribirse:', err);
      alert('No se pudo completar la inscripción');
    }
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">⏳ Cargando curso...</p>;
  if (!course) return <p className="p-6 text-sm text-red-500">❌ Curso no encontrado.</p>;

  return (
    <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20 space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={course.icon ? pb.files.getURL(course, course.icon) : '/placeholder.png'}
          alt={course.title}
          className="h-16 w-16 object-cover rounded"
        />
        <div>
          <h1 className="text-2xl font-bold text-black">{course.title}</h1>
          <p className="text-sm text-gray-500">por {course.author}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        <p>⏱ Duración: {course.duration}</p>
        <p>⭐ Calificación: {course.rating}</p>
      </div>

      <button
        onClick={handleEnroll}
        className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
      >
        Inscribirme al curso
      </button>

      <Link href={`/quiz/${course.id}`}>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition mt-4">
          📚 Hacer examen del curso
        </button>
      </Link>
    </main>
  );
}
