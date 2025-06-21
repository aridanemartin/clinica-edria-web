import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Patient {
  id: string;
  patient_id: string;
  name: string;
  surname: string;
  email: string;
  user_id: string;
  registration_date: string;
  pdf_url?: string;
  created_at: string;
}

export class SupabaseService {
  private static instance: SupabaseService;

  private constructor() {}

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  async createPatient(patientData: Omit<Patient, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating patient:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }

  async getPatientByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting patient:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }

  async getPatientsWithCodeAndName() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, name, surname')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting patients with code and name:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }

  async updatePatient(userId: string, updateData: Partial<Omit<Patient, 'id' | 'user_id' | 'created_at'>>) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating patient:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }

  async deletePatient(userId: string) {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting patient:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }
} 