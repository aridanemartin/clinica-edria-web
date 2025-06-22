'use client';

import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userRole, UserRoleType } from '@/types';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRoleType[];
  fallback?: ReactNode;
}

export default function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallback = <div>No tienes permisos para acceder a esta página.</div> 
}: RoleBasedRouteProps) {
  const { user, userRole: currentUserRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Debes iniciar sesión para acceder a esta página.</div>;
  }

  if (!currentUserRole || !allowedRoles.includes(currentUserRole)) {
    return <>{fallback}</>;
}

  return <>{children}</>;
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={[userRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleBasedRoute>
  );
}

export function ClinicProfessionalOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={[userRole.ADMIN, userRole.CLINIC_PROFESSIONAL]} fallback={fallback}>
      {children}
    </RoleBasedRoute>
  );
} 