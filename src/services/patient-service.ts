import { supabase, Patient } from './supabase-client';
import { BaseService } from './base-service';

export class PatientService extends BaseService {
  private static instance: PatientService;

  private constructor() {
    super();
  }

  public static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  async createPatient(patientData: Omit<Patient, 'id' | 'created_at'>) {
    try {
      this.logOperation('Creating patient', { firebaseId: patientData.firebase_id });
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'creating patient');
    }
  }

  async getPatientByUserId(firebaseId: string) {
    try {
      this.logOperation('Getting patient by user ID', { firebaseId });
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('firebase_id', firebaseId);

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'getting patient');
    }
  }

  async getPatientsWithCodeAndName() {
    try {
      this.logOperation('Getting patients with code and name');
      
      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, name, surname')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'getting patients with code and name');
    }
  }

  async getAllPatients() {
    try {
      this.logOperation('Getting all patients');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'getting all patients');
    }
  }

  async updatePatient(firebaseId: string, updateData: Partial<Omit<Patient, 'id' | 'firebase_id' | 'created_at'>>) {
    try {
      this.logOperation('Updating patient', { firebaseId, updateData });
      
      const { data, error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('firebase_id', firebaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      this.handleError(error, 'updating patient');
    }
  }

  async deletePatient(firebaseId: string) {
    try {
      this.logOperation('Deleting patient', { firebaseId });
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('firebase_id', firebaseId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      this.handleError(error, 'deleting patient');
    }
  }
} 