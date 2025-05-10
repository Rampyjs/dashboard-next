'use client';

import Sidebar from '../components/Sidebar';
import '../app/globals.css';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // Proteger rutas privadas (si no es /login)
    if (!pb.authStore.isValid && !isLoginPage) {
      router.push('/login');
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-white">
        <div className="relative flex min-h-screen overflow-x-hidden">
          {!isLoginPage && <Sidebar />} {/* Solo mostrar si no estás en /login */}
          <div className="flex-1 w-full md:ml-[132px]">{children}</div>
        </div>
      </body>
    </html>
  );
}
