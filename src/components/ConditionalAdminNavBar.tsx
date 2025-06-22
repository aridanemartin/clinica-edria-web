'use client';

import { useAuth } from '@/contexts/AuthContext';
import AdminNavBar from './AdminNavBar/AdminNavBar';

export default function ConditionalAdminNavBar() {
  const { isAdmin, loading } = useAuth();

  // if (loading) {
  //   return null;
  // }

  // if (!isAdmin) {
  //   return null;
  // }

  return <AdminNavBar />;
} 