import daisyui from "daisyui";
import config from "./config.js";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./styles/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "marquee": "marquee 25s linear infinite",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
            },
            colors: {
                primary: config.colors.main,
                "base-100": "#ffffff",
                brand: {
                    red: "#FF3300",
                    purple: "#6600CC",
                    black: "#000000",
                    blue: "#3333FF",
                    pink: "#FF0066",
                    yellow: "#FFFF00",
                    beige: "#F5F2EB",
                }
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        // Light & dark themes are added by default (it switches automatically based on OS settings)
        // You can add more themes here like 'bumblebee', 'cupcake', etc.
        themes: ["light"],
    },
};
