function parseInitials(name: string): string {
    const splitName = name.split(" ", 2);
    let nameInitials = "";

    for (let i = 0; i < splitName.length; i++) {
        nameInitials += splitName[i][0];
    }

    return nameInitials;
}

function needsContrast(hexColour: string): boolean {
    const r = parseInt(hexColour.substring(1, 3), 16);
    const g = parseInt(hexColour.substring(3, 5), 16);
    const b = parseInt(hexColour.substring(5, 7), 16);

    const constrast = r * 0.299 + g * 0.587 + b * 0.114;
    return constrast > 100;
}

const lightTheme: Theme = {
    type: "light",
    primCol: "#FAF9F9",
    secCol: "#C9E4CA",
    accCol: "#55828B",
    contrast: needsContrast("#faf9f9"),
};

const darkTheme: Theme = {
    type: "dark",
    primCol: "#0B3954",
    secCol: "#087E8B",
    accCol: "#BFD7EA",
    contrast: needsContrast("#0B3954"),
};

function getThemeFromCache(): Theme | CustomTheme {
    const cacheTheme = (JSON.parse(
        localStorage.getItem("mumble-theme") || "",
    ) || null) as Theme | CustomTheme | null;

    const theme = cacheTheme // Check if theme is set in localStorage
        ? cacheTheme.type === "custom" // Check if theme is custom
            ? {
                  ...cacheTheme,
                  contrast: needsContrast(cacheTheme.primCol),
              }
            : cacheTheme.type === "light" // Check if theme is light
            ? lightTheme
            : darkTheme // Or return dark theme
        : lightTheme; // Set default theme

    return theme;
}

export {
    parseInitials,
    needsContrast,
    lightTheme,
    darkTheme,
    getThemeFromCache,
};
