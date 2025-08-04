import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#2eb8e8",
                    dark: "#066984",
                    light: "#058abf",
                    accent: "#0487d9",
                    strong: "#19577e",
                },
                secondary: {
                    DEFAULT: "#047b9b",
                    dark: "#004456",
                    mid: "#0367a5",
                },
                purple: {
                    light: "#878fff",
                    mid: "#603fa8",
                    deep: "#004466",
                    strong: "#0367a6",
                },
                gray: {
                    DEFAULT: "#EEEEEE",
                },
            },
            backgroundImage: {
                "gradient-primary":
                    "linear-gradient(270deg, #0487d9, #2eb8e8, #878fff)",
                "gradient-secondary":
                    "linear-gradient(0deg, #0487d9, #2eb8e8, #878fff)",
            },
            opacity: {
                50: "0.5",
            },
            keyframes: {
                "slide-in": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                "slide-on": {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
            animation: {
                "slide-in": "slide-in 1s ease-in-out",
                "slide-on": "slide-on 1s ease-in-out",
            },
            boxShadow: {
                custom: "2px 2px 10px 1.1px rgb(138, 138, 138)",
            },
        },
    },
    plugins: [],
};