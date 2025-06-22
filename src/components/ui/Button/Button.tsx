import React from 'react';
import { ButtonProps } from './Button.types';
import styles from './Button.module.css';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );
} 