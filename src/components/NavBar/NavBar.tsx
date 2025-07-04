'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { useAuth } from '@/contexts/AuthContext';
import styles from './NavBar.module.css';

type NavItem = 
  | { path: string; label: string; type?: 'link' }
  | { type: 'button'; label: string; onClick: () => Promise<void> };

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/inicio');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const baseNavItems: NavItem[] = [
    { path: '/inicio', label: 'Inicio' },
    { path: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { path: '/especialidades', label: 'Especialidades' },
    { path: '/equipo', label: 'Equipo' },
    { path: '/contacto', label: 'Contacto' },
  ];

  const authItems: NavItem[] = user ? [
    { type: 'button', label: 'Cerrar Sesión', onClick: handleLogout }
  ] : [
    { path: '/auth/login', label: 'Login' },
    { path: '/auth/register', label: 'Register' }
  ];

  const navItems = [...baseNavItems, ...authItems];

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <Link href="/inicio" className={styles.logo}>
          Clínica Edria
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {navItems.map((item, index) => (
            <li key={index} className={styles.navLink}>
              {item.type === 'button' ? (
                <button 
                  onClick={item.onClick} 
                  className={styles.logoutButton}
                >
                  {item.label}
                </button>
              ) : (
                <Link href={item.path}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Menu */}
        <div className={styles.hamburger} onClick={toggleMobileMenu}>
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button className={styles.closeButton} onClick={closeMobileMenu}>
          ×
        </button>
        <ul className={styles.mobileNavLinks}>
          {navItems.map((item, index) => (
            <li key={index} className={styles.mobileNavLink}>
              {item.type === 'button' ? (
                <button 
                  onClick={() => {
                    item.onClick();
                    closeMobileMenu();
                  }} 
                  className={styles.logoutButton}
                >
                  {item.label}
                </button>
              ) : (
                <Link href={item.path} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 