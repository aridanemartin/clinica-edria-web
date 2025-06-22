"use client";

import { useState } from "react";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { PatientService } from "@/services/patient-service";
import { createPatientId } from "@/app/_helpers/createPatientId";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);

			if (userCredential.user) {
				try {
					const patientService = PatientService.getInstance();
					
					const patientId = createPatientId(name, surname);

					await patientService.createPatient({
						patient_id: patientId,	
						name,
						surname,
						email,
						firebase_id: userCredential.user.uid,
						registration_date: new Date().toISOString()
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
			let message = "Ha ocurrido un error.";
			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === "string") {
				message = error;
			}
			alert(message);
		}
	};

	return (
		<div className={styles.container}>
			<h1>Registrarse como Paciente</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
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
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
					className={styles.input}
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Contraseña"
					required
					className={styles.input}
				/>

				<button type="submit" className={styles.button}>
					Registrarse como Paciente
				</button>
			</form>
			<div className={styles.linkContainer}>
				<p>¿Ya tienes una cuenta?</p>
				<Link href="/auth/login" className={styles.link}>
					Inicia sesión aquí
				</Link>
			</div>
		</div>
	);
} 