export const createPatientId = (name: string, surname: string) => {
	const currentDate = new Date();
	const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(currentDate.getFullYear()).slice(-2)}`;
	const initials =
		`${name.charAt(0)}${surname.split(" ")[0].charAt(0)}${surname.split(" ")[1]?.charAt(0) || surname.split(" ")[0].charAt(0)}`.toUpperCase();

	return `${initials}_${formattedDate}_${Math.random().toString(36).substring(2, 7)}`;
};
