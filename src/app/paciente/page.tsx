'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/error.module.css';

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
    <main className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Ruta no válida</h1>
      <p className={styles.errorMessage}>
        La ruta /paciente no es accesible directamente. Serás redirigido a la página de inicio.
      </p>
    </main>
  );
} 