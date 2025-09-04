export const TAG_COLORS: { [key: string]: string } = {
    // Languages
    "Astro": "#ff5a00",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "SvelteKit": "#ff3e00",
    "TailwindCSS": "#06b6d4",
    "Supabase": "#3ecf8e",
    "Next.js": "#000000",
    "React": "#61dafb",
    "Stripe": "#6772e5",
    "PostgreSQL": "#4169e1",
    "Flutter": "#02569b",
    "Dart": "#00B4AB",
    "Firebase": "#ffca28",
    "Rust": "#dea584",

    // Default
    "default": "#cccccc"
};

export const getTagColor = (tag: string): string => {
    const lowerCaseTag = tag.toLowerCase();
    for (const key in TAG_COLORS) {
        if (key.toLowerCase() === lowerCaseTag) {
            return TAG_COLORS[key];
        }
    }
    return TAG_COLORS["default"];
};
