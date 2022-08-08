export function parseInitials(name) {
	const splitName = name.split(" ", 2);
	let nameInitials = "";

	for (let i = 0; i < splitName.length; i++) {
		nameInitials += splitName[i][0];
	}

	return nameInitials;
}

export function calcContrast(col) {
	const r = parseInt(col.substring(1, 3), 16);
	const g = parseInt(col.substring(3, 5), 16);
	const b = parseInt(col.substring(5, 7), 16);

	const contrast = r * 0.299 + g * 0.587 + b * 0.114;

	return contrast > 100; // If greater than 100, it's a light color and needs a dark text color
}

export const lightTheme = {
	type: "light",
	primCol: "#faf9f9",
	secCol: "#c9e4ca",
	accCol: "#55828b",
	contrast: calcContrast("#faf9f9"),
};

export const darkTheme = {
	type: "dark",
	primCol: "#0b3954",
	secCol: "#087e8b",
	accCol: "#bfd7ea",
	contrast: calcContrast("#0b3954"),
};

const cacheTheme = JSON.parse(localStorage.getItem("mumble-theme"));
export const theme = cacheTheme // Check if theme is set in localStorage
	? cacheTheme.type === "custom" // Check if theme is custom
		? {
				...cacheTheme,
				contrast: calcContrast(cacheTheme.primCol),
		  }
		: cacheTheme.type === "light" // Check if theme is light
		? lightTheme
		: darkTheme // Or return dark theme
	: lightTheme; // Set default theme
