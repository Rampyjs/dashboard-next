'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import pb from '@/lib/pocketbase';

export default function CourseList({ searchTerm = '' }) {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('All Courses');
  const tabs = ['All Courses', 'The Newest', 'Top Rated', 'Most Popular'];

  useEffect(() => {
    async function fetchCourses() {
      try {
        console.log('📡 URL Base:', pb.baseUrl);
        console.log('👤 Usuario autenticado:', pb.authStore.model);

        const records = await pb.collection('courses').getFullList({ sort: '-created' });

        if (!Array.isArray(records)) {
          throw new Error('La respuesta no es una lista');
        }

        setCourses(records);
        console.log('✅ Cursos cargados:', records);
      } catch (err) {
        console.error('❌ Error REAL al obtener cursos:', {
          message: err.message,
          status: err.status,
          response: err.response,
          err,
        });
      }
    }

    fetchCourses();
  }, []);

  // Filtrar cursos según el texto de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-black">Courses</h2>

      <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-600 border-b pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition ${
              activeTab === tab
                ? 'text-black border-b-2 border-black'
                : 'hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={course.icon ? pb.files.getURL(course, course.icon) : '/placeholder.png'}
                  alt={course.title}
                  className="h-10 w-10 object-cover rounded"
                />
                <div>
                  <h3 className="text-sm font-semibold text-black">{course.title}</h3>
                  <p className="text-xs text-gray-500">by {course.author}</p>
                </div>
              </div>

              <div className="flex gap-4 items-center text-xs text-gray-700">
                <span className="flex items-center gap-1.5">
                  <img src="/clock.png" alt="clock" className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <img src="/fire.png" alt="fire" className="w-4 h-4" />
                  {course.rating}
                </span>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition text-center"
              >
                View course
              </Link>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No courses found.</p>
        )}
      </div>
    </section>
  );
}
