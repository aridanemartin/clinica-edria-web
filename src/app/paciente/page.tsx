'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PacienteError() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Ruta no válida</h1>
      <p className="text-gray-600 mb-6">
        La ruta /paciente no es accesible directamente. Serás redirigido a la página de inicio.
      </p>
    </main>
  );
} 