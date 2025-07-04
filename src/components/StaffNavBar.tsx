'use client';

import { useAuth } from '@/contexts/AuthContext';
import AdminNavBar from './AdminNavBar/AdminNavBar';

export default function StaffNavBar() {
  const { isAdmin, isClinicProfessional, userRole, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin && !isClinicProfessional) {
    return null;
  }

  return <AdminNavBar userRole={userRole} />;
} 