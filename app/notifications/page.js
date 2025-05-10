'use client';

export default function NotificationsPage() {
  const fakeNotifications = [
    {
      id: 1,
      title: 'Te has inscrito al curso "JavaScript para principiantes"',
      date: '08/05/2025',
    },
    {
      id: 2,
      title: 'Tu examen "React Básico" está programado para mañana',
      date: '07/05/2025',
    },
    {
      id: 3,
      title: 'Has completado el curso "HTML + CSS"',
      date: '05/05/2025',
    },
  ];

  return (
    <main className="w-full px-4 sm:px-6 xl:px-8 2xl:px-10 pt-6 pb-20 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notificaciones</h1>
      <div className="space-y-4">
        {fakeNotifications.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <h2 className="text-lg font-medium text-gray-900">{note.title}</h2>
            <p className="text-sm text-gray-500">{note.date}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
