'use client'

import { AuthProvider } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar/NavBar';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NavBar />
      <div style={{ marginTop: '80px' }}>{children}</div>
    </AuthProvider>
  );
} 