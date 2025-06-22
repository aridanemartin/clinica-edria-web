'use client';

import Link from 'next/link';
import styles from './AdminNavBar.module.css';

export default function AdminNavBar() {
  const adminNavItems = [
    { path: '/buscador-de-pacientes', label: 'Buscador de Pacientes' },
    { path: '/gestion-de-profesionales', label: 'Gestión de Profesionales' },
  ];

  return (
    <nav className={styles.adminNavContainer}>
      <div className={styles.adminNavContent}>
        <span className={styles.adminBrand}>Panel de Administrador</span>
        
        <ul className={styles.adminNavLinks}>
          {adminNavItems.map((item) => (
            <li key={item.path} className={styles.adminNavLink}>
              <Link href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 