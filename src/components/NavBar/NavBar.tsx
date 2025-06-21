'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/inicio', label: 'Inicio' },
    { path: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { path: '/especialidades', label: 'Especialidades' },
    { path: '/pacientes', label: 'Pacientes' },
    { path: '/auth/login', label: 'Login' },
    { path: '/auth/register', label: 'Register' },
    { path: '/equipo', label: 'Equipo' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <Link href="/inicio" className={styles.logo}>
          Clínica Edria
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navLink}>
              <Link href={item.path}>{item.label}</Link>
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
          {navItems.map((item) => (
            <li key={item.path} className={styles.mobileNavLink}>
              <Link href={item.path} onClick={closeMobileMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 