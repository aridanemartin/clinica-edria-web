'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Algo salió mal</h1>
      <p className={styles.errorMessage}>{error.message}</p>
      <div className={styles.errorActions}>
        <button
          onClick={() => reset()}
          className={styles.errorButtonPrimary}
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => router.push('/')}
          className={styles.errorButtonSecondary}
        >
          Volver al inicio
        </button>
      </div>
    </main>
  );
} 