'use client'

import { useRouter } from 'next/navigation';
import styles from '@/styles/error.module.css';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Página no encontrada</h1>
      <p className={styles.errorMessage}>Lo sentimos, la página que buscas no existe.</p>
      <div className={styles.errorActions}>
        <button
          onClick={() => router.push('/')}
          className={styles.errorButtonPrimary}
        >
          Volver al inicio
        </button>
      </div>
    </main>
  );
} 