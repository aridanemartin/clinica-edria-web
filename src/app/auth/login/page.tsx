"use client";

import { useState, useRef } from "react";
import { auth } from "@/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClinicProfessionalService } from "@/services/clinic-professional-service";
import { PatientService } from "@/services/patient-service";
import { Patient } from "@/services/supabase-client";
import styles from "./login.module.css";

const userType = {
	CLINIC_PROFESSIONAL: "CLINIC_PROFESSIONAL",
	PATIENT: "PATIENT",
} as const;

type UserType = typeof userType[keyof typeof userType];

export default function LoginPage() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [selectedUserType, setSelectedUserType] = useState<UserType>(userType.PATIENT);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const email = emailRef.current?.value || "";
		const password = passwordRef.current?.value || "";

		try {
			if (selectedUserType === userType.CLINIC_PROFESSIONAL) {
				const professionalService = ClinicProfessionalService.getInstance();
				const professionals = await professionalService.getClinicProfessionals();
				const professional = professionals?.find(p => p.email === email);
				
				if (!professional) {
					alert("No se encontró un profesional con este email. Por favor, verifica que estés usando el flujo correcto.");
					return;
				}
			} else {
				const patientService = PatientService.getInstance();
				const allPatients = await patientService.getAllPatients();
				const patient = allPatients?.find((p: Patient) => p.email === email);
				
				if (!patient) {
					alert("No se encontró un paciente con este email. Por favor, verifica que estés usando el flujo correcto.");
					return;
				}
			}

			// If user exists in the appropriate service, proceed with Firebase authentication
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);

			if (userCredential.user) {
				const userId = userCredential.user.uid;

				if (selectedUserType === userType.CLINIC_PROFESSIONAL) {
					// Double-check that the authenticated user matches the professional
					const professionalService = ClinicProfessionalService.getInstance();
					const professional = await professionalService.getClinicProfessionalByFirebaseId(userId);
					
					if (professional) {
						// Redirect to professional dashboard
						router.push("/buscador-de-pacientes");
					} else {
						alert("Error: El usuario autenticado no coincide con un profesional registrado.");
						await auth.signOut();
					}
				} else {
					// Double-check that the authenticated user matches the patient
					const patientService = PatientService.getInstance();
					const patient = await patientService.getPatientByUserId(userId);
					
					if (patient) {
						// Redirect to patient dashboard
						router.push(`/paciente/${userId}`);
					} else {
						alert("Error: El usuario autenticado no coincide con un paciente registrado.");
						await auth.signOut();
					}
				}
			}
		} catch (error) {
			let message = "Ha ocurrido un error.";
			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === "string") {
				message = error;
			}
			alert(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h1>Iniciar Sesión</h1>
			
			{/* User Type Selection */}
			<div className={styles.userTypeContainer}>
				<h3>Selecciona tu tipo de usuario:</h3>
				<div className={styles.userTypeButtons}>
					<button
						type="button"
						className={`${styles.userTypeButton} ${selectedUserType === userType.PATIENT ? styles.active : ""}`}
						onClick={() => setSelectedUserType(userType.PATIENT)}
					>
						Paciente
					</button>
					<button
						type="button"
						className={`${styles.userTypeButton} ${selectedUserType === userType.CLINIC_PROFESSIONAL ? styles.active : ""}`}
						onClick={() => setSelectedUserType(userType.CLINIC_PROFESSIONAL)}
					>
						Profesional
					</button>
				</div>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					ref={emailRef}
					type="email"
					placeholder="Email"
					required
					className={styles.input}
				/>
				<input
					ref={passwordRef}
					type="password"
					placeholder="Contraseña"
					required
					className={styles.input}
				/>
				<button 
					type="submit" 
					className={styles.button}
					disabled={isLoading}
				>
					{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
				</button>
			</form>
			<div className={styles.linkContainer}>
				<p>¿No tienes una cuenta?</p>
				<Link href="/auth/register" className={styles.link}>
					Regístrate aquí
				</Link>
			</div>
		</div>
	);
} 