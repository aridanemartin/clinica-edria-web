import { useState } from "react";


const validatePassword = (password: string): string => {
	if (password.length < 6) {
		return "La contraseña debe tener al menos 6 caracteres";
	}
	return "";
};

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
	if (confirmPassword === "") {
		return "Por favor confirma tu contraseña";
	}
	if (password !== confirmPassword) {
		return "Las contraseñas no coinciden";
	}
	return "";
};

export const useRegistrationForm = () => {
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const updatePasswordValidation = (password: string, confirmPassword: string) => {
		setPasswordError(validatePassword(password));
		setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));
	};

	const updateConfirmPasswordValidation = (password: string, confirmPassword: string) => {
		setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));
	};

	const clearErrors = () => {
		setPasswordError("");
		setConfirmPasswordError("");
	};

	return {
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
	};
}; 