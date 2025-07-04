"use client";

import { useState, useRef, forwardRef } from "react";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { PatientService } from "@/services/patient-service";
import { createPatientId } from "@/app/_helpers/createPatientId";
import Link from "next/link";
import styles from "./register.module.css";
import { useRegistrationForm } from "./hooks/useRegistrationForm";

// Password input component
const PasswordInput = forwardRef<HTMLInputElement, {
	placeholder: string;
	error: string;
	onChange: () => void;
}>(({ placeholder, error, onChange }, ref) => (
	<div className={styles.passwordContainer}>
		<input
			ref={ref}
			type="password"
			placeholder={placeholder}
			required
			className={`${styles.input} ${error ? styles.inputError : ''}`}
			onChange={onChange}
		/>
		{error && <span className={styles.errorMessage}>{error}</span>}
	</div>
));

PasswordInput.displayName = 'PasswordInput';

// Registration form component
const RegistrationForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	
	const {
		name,
		setName,
		surname,
		setSurname,
		passwordError,
		confirmPasswordError,
		updatePasswordValidation,
		updateConfirmPasswordValidation,
	} = useRegistrationForm();

	const handlePasswordChange = () => {
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";
		updatePasswordValidation(password, confirmPassword);
	};

	const handleConfirmPasswordChange = () => {
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";
		updateConfirmPasswordValidation(password, confirmPassword);
	};

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Nombre"
				required
				className={styles.input}
			/>
			<input
				type="text"
				value={surname}
				onChange={(e) => setSurname(e.target.value)}
				placeholder="Apellidos"
				required
				className={styles.input}
			/>
			<input
				ref={emailRef}
				type="email"
				placeholder="Email"
				required
				className={styles.input}
			/>
			<PasswordInput
				ref={passwordRef}
				placeholder="Contraseña"
				error={passwordError}
				onChange={handlePasswordChange}
			/>
			<PasswordInput
				ref={confirmPasswordRef}
				placeholder="Confirmar Contraseña"
				error={confirmPasswordError}
				onChange={handleConfirmPasswordChange}
			/>
			<button type="submit" className={styles.button}>
				Registrarse como Paciente
			</button>
		</form>
	);
};

// Service functions
const createPatientRecord = async (userData: {
	uid: string;
	email: string;
	name: string;
	surname: string;
}) => {
	const patientService = PatientService.getInstance();
	const patientId = createPatientId(userData.name, userData.surname);

	await patientService.createPatient({
		patient_id: patientId,
		name: userData.name,
		surname: userData.surname,
		email: userData.email,
		firebase_id: userData.uid,
		registration_date: new Date().toISOString()
	});
};

const handleRegistrationError = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	} else if (typeof error === "string") {
		return error;
	}
	return "Ha ocurrido un error.";
};

// Main component
export default function RegisterPage() {
	const router = useRouter();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	
	const {
		name,
		setName,
		surname,
		setSurname,
		passwordError,
		confirmPasswordError,
		updatePasswordValidation,
		updateConfirmPasswordValidation,
		clearErrors,
		validatePassword,
		validateConfirmPassword,
	} = useRegistrationForm();

	const validateForm = (): boolean => {
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";
		
		const passwordValidationError = validatePassword(password);
		const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);
		
		updatePasswordValidation(password, confirmPassword);
		
		return !passwordValidationError && !confirmPasswordValidationError;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}
		
		const email = emailRef.current?.value || "";
		const password = passwordRef.current?.value || "";
		
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			if (userCredential.user) {
				try {
					await createPatientRecord({
						uid: userCredential.user.uid,
						email,
						name,
						surname,
					});
				} catch (error) {
					console.error("Error creating user record:", error);
					alert("Error creating user record. Please try again or contact support.");
					return;
				}
			}

			if (userCredential.user) {
				router.push(`/paciente/${userCredential.user.uid}`);
			}
		} catch (error) {
			const message = handleRegistrationError(error);
			alert(message);
		}
	};

	return (
		<div className={styles.container}>
			<h1>Registrarse como Paciente</h1>
			<RegistrationForm onSubmit={handleSubmit} />
			<div className={styles.linkContainer}>
				<p>¿Ya tienes una cuenta?</p>
				<Link href="/auth/login" className={styles.link}>
					Inicia sesión aquí
				</Link>
			</div>
		</div>
	);
} 