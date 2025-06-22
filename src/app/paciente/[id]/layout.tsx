'use client'

import styles from './layout.module.css';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.patientIdContent}>{children}</div>
  );
} 