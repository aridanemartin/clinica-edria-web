import React from 'react';
import { InputProps } from './Input.types';

export default function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  className = '',
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      className={className}
    />
  );
} 