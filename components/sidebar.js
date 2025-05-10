'use client';

import {
  FaHome,
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle, // ✅ nuevo icono
} from 'react-icons/fa';

import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {/* Sidebar para escritorio */}
      <aside className="hidden md:flex fixed top-6 left-6 h-[calc(100vh-3rem)] w-[132px] bg-black text-white flex-col justify-between items-center shadow-2xl rounded-3xl py-8 z-40 relative">
        {/* Logo */}
        <div className="text-5xl font-extrabold tracking-widest">F.</div>

        {/* Menú de navegación */}
        <nav className="flex flex-col items-center space-y-12 text-2xl">
          <Link href="/" title="Inicio" className="hover:text-blue-400 transition">
            <FaHome />
          </Link>
          <Link href="/courses" title="Cursos" className="hover:text-blue-400 transition">
            <FaGraduationCap />
          </Link>
          <Link href="/quiz" title="Exámenes" className="hover:text-blue-400 transition">
            <FaQuestionCircle />
          </Link>
          <Link href="/account/edit" title="Perfil" className="hover:text-blue-400 transition">
            <FaUser />
          </Link>
          <Link href="/notifications" title="Notificaciones" className="hover:text-blue-400 transition">
            <FaEnvelope />
          </Link>

          {/* Botón de configuración con menú flotante */}
          <div className="relative">
            <button onClick={toggleMenu} className="hover:text-blue-400 transition">
              <FaCog />
            </button>

            {showMenu && (
              <div className="absolute left-14 top-[-20px] w-48 bg-zinc-900 text-white rounded-xl shadow-xl p-3 z-50 space-y-1">
                <Link
                  href="/account/edit"
                  className="block hover:bg-zinc-800 rounded-lg px-3 py-2 text-sm transition"
                  onClick={() => setShowMenu(false)}
                >
                  ✏️ Editar perfil
                </Link>
                <Link
                  href="/account"
                  className="block hover:bg-zinc-800 rounded-lg px-3 py-2 text-sm transition"
                  onClick={() => setShowMenu(false)}
                >
                  🔒 Cambiar contraseña
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="text-2xl hover:text-red-500 transition"
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </aside>

      {/* Navbar móvil */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <nav className="h-16 bg-black text-white flex justify-around items-center text-2xl relative">
          <Link href="/" title="Inicio" className="hover:text-blue-400 transition">
            <FaHome />
          </Link>
          <Link href="/courses" title="Cursos" className="hover:text-blue-400 transition">
            <FaGraduationCap />
          </Link>
          <Link href="/quiz" title="Exámenes" className="hover:text-blue-400 transition">
            <FaQuestionCircle />
          </Link>
          <Link href="/account/edit" title="Perfil" className="hover:text-blue-400 transition">
            <FaUser />
          </Link>
          <Link href="/notifications" title="Notificaciones" className="hover:text-blue-400 transition">
            <FaEnvelope />
          </Link>
          <button onClick={toggleMenu} title="Opciones" className="hover:text-blue-400 transition relative">
            <FaCog />
          </button>
        </nav>

        {/* Menú flotante para móviles */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute bottom-20 right-4 bg-zinc-900 text-white rounded-xl shadow-xl p-3 z-50 space-y-1 w-48">
              <Link
                href="/account/edit"
                className="block hover:bg-zinc-800 rounded-lg px-3 py-2 text-sm transition"
                onClick={() => setShowMenu(false)}
              >
                ✏️ Editar perfil
              </Link>
              <Link
                href="/account"
                className="block hover:bg-zinc-800 rounded-lg px-3 py-2 text-sm transition"
                onClick={() => setShowMenu(false)}
              >
                🔒 Cambiar contraseña
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
