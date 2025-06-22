import { createClient } from '@supabase/supabase-js';
import { UserRoleType } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Patient {
  id: string;
  patient_id: string;
  name: string;
  surname: string;
  email: string;
  firebase_id: string;
  registration_date: string;
  pdf_url?: string;
  created_at: string;
}

export interface Professional {
  id: string;
  name: string;
  surname: string;
  specialty: string;
  email: string;
  firebase_id: string;
  phone?: string;
  active: boolean;
  created_at: string;
}

export interface UserRole {
  id: string;
  firebase_id: string;
  role: UserRoleType;
  created_at: string;
} 