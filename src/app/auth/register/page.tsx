"use client";

import { useState } from "react";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SupabaseService } from "@/services/supabase";
import { createPatientId } from "@/app/_helpers/createPatientId";
import Link from "next/link";

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
					const supabaseService = SupabaseService.getInstance();
					const patientId = createPatientId(name, surname);

					await supabaseService.createPatient({
						patient_id: patientId,	
						name,
						surname,
						email,
						user_id: userCredential.user.uid,
						registration_date: new Date().toISOString()
					});

				} catch (error) {
					console.error("Error creating patient record:", error);
					alert("Error creating patient record. Please try again or contact support.");
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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "20px",
				maxWidth: "300px",
				margin: "0 auto",
				padding: "20px",
			}}
		>
			<h1>Registrarse</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", flexDirection: "column", gap: "10px" }}
			>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Nombre"
					required
				/>
				<input
					type="text"
					value={surname}
					onChange={(e) => setSurname(e.target.value)}
					placeholder="Apellidos"
					required
				/>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Contraseña"
					required
				/>
				<button type="submit">
					Registrarse
				</button>
			</form>
			<div style={{ textAlign: "center" }}>
				<p>¿Ya tienes una cuenta?</p>
				<Link href="/auth/login" style={{ color: "blue", textDecoration: "underline" }}>
					Inicia sesión aquí
				</Link>
			</div>
		</div>
	);
} 