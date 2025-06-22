'use client'

import { AuthProvider } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar/NavBar';
import styles from './layout.module.css';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={styles.patientContent}>{children}</div>
    </AuthProvider>
  );
} 