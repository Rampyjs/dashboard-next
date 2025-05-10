'use client';

import CourseList from '@/components/CourseList';

export default function CoursesPage() {
  return (
    <main className="w-full px-4 sm:px-6 xl:px-8 2xl:px-10 pt-6 pb-20 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todos los cursos</h1>
      <CourseList />
    </main>
  );
}
