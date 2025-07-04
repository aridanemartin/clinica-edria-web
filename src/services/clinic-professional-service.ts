import { supabase } from './supabase-client';
import { BaseService } from './base-service';
import { UserRoleType } from '@/types';

export interface ClinicProfessional {
  id: string;
  name: string;
  surname: string;
  specialty: string;
  email: string;
  firebase_id: string;
  phone?: string;
  is_active: boolean;
  role: UserRoleType;
  created_at: string;
}

export class ClinicProfessionalService extends BaseService {
  private static instance: ClinicProfessionalService;

  private constructor() {
    super();
  }

  public static getInstance(): ClinicProfessionalService {
    if (!ClinicProfessionalService.instance) {
      ClinicProfessionalService.instance = new ClinicProfessionalService();
    }
    return ClinicProfessionalService.instance;
  }

  async createClinicProfessional(professionalData: Omit<ClinicProfessional, 'id' | 'created_at'>) {
    try {
      this.logOperation('Creating clinic professional', { firebaseId: professionalData.firebase_id, role: professionalData.role });
      
      const { data, error } = await supabase
        .from('clinic_professionals')
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'creating clinic professional');
    }
  }

  async getClinicProfessionals() {
    try {
      this.logOperation('Getting clinic professionals');
      
      const { data, error } = await supabase
        .from('clinic_professionals')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'getting clinic professionals');
    }
  }

  async getClinicProfessionalByFirebaseId(firebaseId: string): Promise<ClinicProfessional | null> {
    try {
      this.logOperation('Getting clinic professional by user ID', { firebaseId });

      const { data, error } = await supabase
        .from('clinic_professionals')
        .select('*')
        .eq('firebase_id', firebaseId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error: any) {
      this.handleError(error, 'getting clinic professional');
      return null;
    }
  }

  async updateClinicProfessional(firebaseId: string, updateData: Partial<Omit<ClinicProfessional, 'id' | 'firebase_id' | 'created_at'>>) {
    try {
      this.logOperation('Updating clinic professional', { firebaseId, updateData });
      
      const { data, error } = await supabase
        .from('clinic_professionals')
        .update(updateData)
        .eq('firebase_id', firebaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'updating clinic professional');
    }
  }

  async deleteClinicProfessional(professionalId: string) {
    try {
      this.logOperation('Deleting clinic professional', { professionalId });
      
      const { error } = await supabase
        .from('clinic_professionals')
        .delete()
        .eq('id', professionalId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      this.handleError(error, 'deleting clinic professional');
    }
  }

  async getClinicProfessionalRole(firebaseId: string) {
    try {
      this.logOperation('Getting clinic professional role', { firebaseId });
      
      const { data, error } = await supabase
        .from('clinic_professionals')
        .select('role')
        .eq('firebase_id', firebaseId);

      if (error) throw error;
      return data?.[0]?.role;
    } catch (error: any) {
      this.handleError(error, 'getting clinic professional role');
    }
  }
} 