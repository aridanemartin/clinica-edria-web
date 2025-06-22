export interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
} 