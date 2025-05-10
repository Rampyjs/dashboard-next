import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

// Restaurar sesión desde localStorage (más confiable que cookies en dev)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pb_auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      pb.authStore.save(parsed.token, parsed.model);
    } catch (e) {
      console.error('Error al cargar sesión local:', e);
    }
  }

  // Guardar sesión cada vez que cambie (login/logout)
  pb.authStore.onChange(() => {
    localStorage.setItem(
      'pb_auth',
      JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model,
      })
    );
  });
}

export default pb;
