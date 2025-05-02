'use client'

import { useAuth } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import { useParams } from 'next/navigation';

export default function PacienteDashboard() {
  const { user } = useAuth();
  const params = useParams();
  const patientId = params.id as string;

  // Check if the current user is authorized to view this patient's data
  const isAuthorized = user?.uid === patientId;

  return (
    <PrivateRoute>
      {isAuthorized ? (
        <main>
          <h1>Bienvenido, {user?.email}</h1>
          <p>Este es tu panel de paciente</p>
        </main>
      ) : (
        <main>
          <h1>Acceso no autorizado</h1>
          <p>No tienes permiso para ver esta información</p>
        </main>
      )}
    </PrivateRoute>
  );
} 