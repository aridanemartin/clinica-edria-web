'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  // If we're on a patient route, check if the user is authorized
  if (patientId && user.uid !== patientId) {
    return (
      <main>
        <h1>Acceso no autorizado</h1>
        <p>No tienes permiso para ver esta información</p>
      </main>
    );
  }

  return <>{children}</>;
} 