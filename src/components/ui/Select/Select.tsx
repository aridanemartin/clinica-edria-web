import React from 'react';
import { SelectProps } from './Select.types';

export default function Select({
  name,
  value,
  onChange,
  required = false,
  className = '',
  children,
}: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
    >
      {children}
    </select>
  );
} 