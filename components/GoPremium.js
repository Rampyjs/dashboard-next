'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function GoPremium() {
  return (
    <div className="w-full bg-[#F5F5F7] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between px-6 py-6 md:px-8 md:py-7">
      {/* Texto a la izquierda */}
      <div className="flex flex-col justify-center text-center sm:text-left sm:w-2/3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-1">
          Learn even more!
        </h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4 leading-snug">
          Unlock premium features<br />
          only for €9.99 per month.
        </p>
        <Link
          href="/premium"
          className="bg-black text-white text-sm px-5 py-2 rounded-md font-semibold hover:bg-gray-800 transition w-fit mx-auto sm:mx-0"
        >
          Go Premium
        </Link>
      </div>

      {/* Imagen a la derecha */}
      <div className="relative w-[120px] sm:w-[130px] md:w-[140px] h-[120px] sm:h-[130px] md:h-[140px] mt-4 sm:mt-0">
        <Image
          src="/brain.png"
          alt="Go Premium"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
