'use client';

import Link from 'next/link';
import { UserRoleType } from '@/types';
import styles from './AdminNavBar.module.css';

interface AdminNavBarProps {
  userRole: UserRoleType | null;
}

export default function AdminNavBar({ userRole }: AdminNavBarProps) {
  if (!userRole) return null;

  const allNavItems = [
    { path: '/buscador-de-pacientes', label: 'Buscador de Pacientes', roles: ['ADMIN', 'CLINIC_PROFESSIONAL'] },
    { path: '/gestion-de-profesionales', label: 'Gestión de Profesionales', roles: ['ADMIN'] },
  ];

  const allowedByRoleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className={styles.adminNavContainer}>
      <div className={styles.adminNavContent}>
        <span className={styles.adminBrand}>
          {userRole === 'ADMIN' ? 'Panel de Administrador' : 'Panel de Profesional'}
        </span>
        <ul className={styles.adminNavLinks}>
          {allowedByRoleNavItems.map((item) => (
            <li key={item.path} className={styles.adminNavLink}>
              <Link href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 