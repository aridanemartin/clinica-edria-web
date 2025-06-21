"use client";

import { useState } from "react";
import { auth } from "@/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);

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
			<h1>Iniciar Sesión</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", flexDirection: "column", gap: "10px" }}
			>
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
					Iniciar sesión
				</button>
			</form>
			<div style={{ textAlign: "center" }}>
				<p>¿No tienes una cuenta?</p>
				<Link href="/auth/register" style={{ color: "blue", textDecoration: "underline" }}>
					Regístrate aquí
				</Link>
			</div>
		</div>
	);
} 