'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/client';
import { ClinicProfessionalService } from '../services/clinic-professional-service';
import { PatientService } from '../services/patient-service';
import { userRole as userRoles, UserRoleType } from '@/types';

interface AuthContextType {
  user: User | null;
  userRole: UserRoleType | null;
  loading: boolean;
  isAdmin: boolean;
  isClinicProfessional: boolean;
  isPatient: boolean;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  isAdmin: false,
  isClinicProfessional: false,
  isPatient: false,
  refreshUserRole: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserRole = async (userId: string) => {
    try {
      const clinicProfessionalService = ClinicProfessionalService.getInstance();
      const patientService = PatientService.getInstance();
      
      // First check if user is a clinic professional (admin or professional)
      const professional = await clinicProfessionalService.getClinicProfessionalByUserId(userId);
      
      if (professional) {
        setUserRole(professional.role);
        return;
      }
      
      // If not a professional, check if user is a patient
      const patients = await patientService.getPatientByUserId(userId);
      
      if (patients && patients.length > 0) {
        setUserRole(userRoles.PATIENT);
      }
      
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole(null);
    }
  };

  const refreshUserRole = async () => {
    if (user) {
      await loadUserRole(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadUserRole(user.uid);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userRole === userRoles.ADMIN;
  const isClinicProfessional = userRole === userRoles.CLINIC_PROFESSIONAL;
  const isPatient = userRole === userRoles.PATIENT;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      loading, 
      isAdmin, 
      isClinicProfessional, 
      isPatient,
      refreshUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 