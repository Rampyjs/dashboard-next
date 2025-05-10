'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import pb from '@/lib/pocketbase';

export default function QuizListPage() {
  const [coursesWithQuizzes, setCoursesWithQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoursesWithQuizzes() {
      try {
        const quizzes = await pb.collection('quizzes').getFullList({
          expand: 'course_id',
        });

        console.log('✅ Quizzes:', quizzes);

        const courseMap = new Map();

        quizzes.forEach((quiz) => {
          const course = quiz.expand?.course_id;
          if (course && !courseMap.has(course.id)) {
            courseMap.set(course.id, course);
          }
        });

        const courses = [...courseMap.values()];
        console.log('✅ Cursos con quizzes:', courses);
        setCoursesWithQuizzes(courses);
      } catch (error) {
        console.error('❌ Error loading quiz courses:', {
          message: error?.message,
          status: error?.status,
          response: error?.response,
        });
        alert('Error cargando los cursos con quiz. Revisa la consola.');
      } finally {
        setLoading(false);
      }
    }

    fetchCoursesWithQuizzes();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando exámenes...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📚 Exámenes disponibles</h1>

      {coursesWithQuizzes.length === 0 ? (
        <p className="text-center text-gray-500">Aún no hay cursos con exámenes disponibles.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {coursesWithQuizzes.map((course) => (
            <li key={course.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
              <p className="text-sm text-gray-500 mb-3">por {course.author}</p>
              <Link
                href={`/quiz/${course.id}`}
                className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Hacer examen
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
