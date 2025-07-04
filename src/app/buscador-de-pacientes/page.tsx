"use client";

import { useState, useEffect } from "react";
import { PatientService } from "@/services/patient-service";
import { AdminOnly, ClinicProfessionalOnly } from "@/components/RoleBasedRoute";
import styles from "./buscador.module.css";

interface PatientSummary {
  patient_id: string;
  name: string;
  surname: string;
}

function BuscadorPacientesContent() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientService = PatientService.getInstance();
      const patientsData = await patientService.getPatientsWithCodeAndName();
      if (patientsData) {
        setPatients(patientsData);
        setFilteredPatients(patientsData);
      } else {
        setPatients([]);
        setFilteredPatients([]);
      }
    } catch (err) {
      setError("Error al cargar los pacientes. Por favor, inténtalo de nuevo.");
      console.error("Error loading patients:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={loadPatients}
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Buscador de Pacientes
      </h1>
      
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o código de paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        {filteredPatients.length === 0 ? (
          <p>No se encontraron pacientes.</p>
        ) : (
          <p>
            Mostrando {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Patients Table */}
      {filteredPatients.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Código de Paciente</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Nombre Completo</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr 
                  key={patient.patient_id}
                  className={styles.tableRow}
                >
                  <td className={styles.patientCode}>
                    {patient.patient_id}
                  </td>
                  <td className={styles.tableCell}>
                    {patient.name}
                  </td>
                  <td className={styles.tableCell}>
                    {patient.surname}
                  </td>
                  <td className={styles.patientName}>
                    {patient.name} {patient.surname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredPatients.length === 0 && !loading && !error && (
        <div className={styles.emptyState}>
          <p>No hay pacientes registrados en la base de datos.</p>
        </div>
      )}
    </div>
  );
}

export default function BuscadorPacientes() {
  return (
    <ClinicProfessionalOnly>
      <BuscadorPacientesContent />
    </ClinicProfessionalOnly>
  );
} 