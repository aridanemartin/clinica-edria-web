"use client";

import { useState, useEffect, useRef } from "react";
import { AdminOnly } from "@/components/RoleBasedRoute";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ClinicProfessionalService } from "@/services/clinic-professional-service";
import { userRole, UserRoleType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./gestion.module.css";

interface ProfessionalDisplay {
  id: string;
  name: string;
  surname: string;
  specialty: string;
  email: string;
  phone?: string;
  active: boolean;
  role: UserRoleType;
}

function GestionProfesionalesContent() {
  const [professionals, setProfessionals] = useState<ProfessionalDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    specialty: "",
    phone: "",
    role: userRole.CLINIC_PROFESSIONAL as UserRoleType
  });
  const [submitting, setSubmitting] = useState(false);
  const { refreshUserRole } = useAuth();
  
  // Refs for email and password to avoid re-renders
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const clinicProfessionalService = ClinicProfessionalService.getInstance();
      const data = await clinicProfessionalService.getClinicProfessionals();
      setProfessionals(data || []);
    } catch (error) {
      console.error("Error loading professionals:", error);
  
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        const clinicProfessionalService = ClinicProfessionalService.getInstance();
        
        await clinicProfessionalService.createClinicProfessional({
          name: formData.name,
          surname: formData.surname,
          specialty: formData.specialty,
          email: email,
          firebase_id: userCredential.user.uid,
          phone: formData.phone || undefined,
          is_active: true,
          role: formData.role
        });

        setFormData({
          name: "",
          surname: "",
          specialty: "",
          phone: "",
          role: userRole.CLINIC_PROFESSIONAL as UserRoleType
        });
        
        // Clear refs
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        
        setShowModal(false);
        
        await loadProfessionals();
        
        // Refresh the current user's role to ensure permissions are maintained
        await refreshUserRole();
        
        alert("Profesional creado exitosamente");
      }
    } catch (error) {
      let message = "Ha ocurrido un error al crear el profesional.";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteProfessional = async (professionalId: string, professionalName: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar al profesional "${professionalName}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const clinicProfessionalService = ClinicProfessionalService.getInstance();
      await clinicProfessionalService.deleteClinicProfessional(professionalId);
      
      // Reload the professionals list
      await loadProfessionals();
      
      alert("Profesional eliminado exitosamente");
    } catch (error) {
      let message = "Ha ocurrido un error al eliminar el profesional.";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando profesionales...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Gestión de Profesionales
      </h1>
      
      <div className={styles.addButtonContainer}>
        <button 
          onClick={() => setShowModal(true)}
          className={styles.addButton}
        >
          + Añadir Profesional
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>
                Nombre Completo
              </th>
              <th>
                Especialidad
              </th>
              <th>
                Email
              </th>
              <th>
                Teléfono
              </th>
              <th className={styles.tableHeaderCenter}>
                Rol
              </th>
              <th className={styles.tableHeaderCenter}>
                Estado
              </th>
              <th className={styles.tableHeaderCenter}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional, index) => (
              <tr 
                key={professional.id}
                className={styles.tableRow}
              >
                <td className={styles.professionalName}>
                  {professional.name} {professional.surname}
                </td>
                <td className={styles.tableCell}>
                  {professional.specialty}
                </td>
                <td className={styles.tableCell}>
                  {professional.email}
                </td>
                <td className={styles.tableCell}>
                  {professional.phone || "No disponible"}
                </td>
                <td className={styles.tableCellCenter}>
                  <span className={`${styles.roleBadge} ${professional.role === userRole.ADMIN ? styles.roleAdmin : styles.roleProfessional}`}>
                    {professional.role === userRole.ADMIN ? 'Administrador' : 'Profesional'}
                  </span>
                </td>
                <td className={styles.tableCellCenter}>
                  <span className={`${styles.statusBadge} ${professional.active ? styles.statusActive : styles.statusInactive}`}>
                    {professional.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className={styles.tableCellCenter}>
                  <button className={`${styles.actionButton} ${styles.editButton}`}>
                    Editar
                  </button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDeleteProfessional(professional.id, `${professional.name} ${professional.surname}`)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p>Total de profesionales: {professionals.length}</p>
      </div>

      {/* Modal for adding new professional */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Crear Nuevo Profesional</h2>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
                className={styles.modalInput}
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="Apellidos"
                required
                className={styles.modalInput}
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                required
                className={styles.modalInput}
              />
              <input
                ref={passwordRef}
                type="password"
                placeholder="Contraseña"
                required
                className={styles.modalInput}
              />
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="Especialidad"
                required
                className={styles.modalInput}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Teléfono (opcional)"
                className={styles.modalInput}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className={styles.modalSelect}
              >
                <option value={userRole.CLINIC_PROFESSIONAL}>Profesional Clínico</option>
                <option value={userRole.ADMIN}>Administrador</option>
              </select>
              
              <div className={styles.modalButtons}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={styles.submitButton}
                >
                  {submitting ? 'Creando...' : 'Crear Profesional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GestionProfesionalesPage() {
  return (
    <AdminOnly>
      <GestionProfesionalesContent />
    </AdminOnly>
  );
} 