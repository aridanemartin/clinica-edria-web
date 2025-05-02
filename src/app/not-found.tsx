'use client'

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe.</p>
      <button
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al inicio
      </button>
    </main>
  );
} 