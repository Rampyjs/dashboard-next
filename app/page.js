'use client';

import { useState } from 'react';
import Header from '../components/Header';
import MyCourses from '../components/MyCourses';
import CourseList from '../components/CourseList';
import Statistics from '../components/Statistics';
import GoPremium from '../components/GoPremium';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main
      className="
        w-full
        px-4 sm:px-6 xl:px-8 2xl:px-10
        pt-6 pb-20
        max-w-screen-2xl
        mx-auto
      "
    >
      {/* ✅ PASAMOS setSearchTerm al Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:justify-start gap-12 mt-10">
        <div className="w-full flex flex-col space-y-8">
          <MyCourses />
          <CourseList searchTerm={searchTerm} />
        </div>
        <div className="w-full flex flex-col space-y-8">
          <Statistics />
          <GoPremium />
        </div>
      </div>
    </main>
  );
}
