export const userRole = {
  ADMIN: 'ADMIN',
  CLINIC_PROFESSIONAL: 'CLINIC_PROFESSIONAL',
  PATIENT: 'PATIENT'
} as const;

export type UserRoleType = typeof userRole[keyof typeof userRole];

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
} 