import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#182237",
          light: "#6cb2eb",
          dark: "#2779bd",
        },
        secondary: {
          DEFAULT: "#ffed4a",
          light: "#fff382",
          dark: "#f2d024",
        },
        background: {
          DEFAULT: "#f8fafc",
          dark: "#1a202c",
        },
        text: {
          DEFAULT: "#1a202c",
          light: "#ffffff",
          dark: "#1a202c",
        },
        accent: {
          DEFAULT: "#ed64a6",
          light: "#f687b3",
          dark: "#d53f8c",
        },
        success: "#38a169",
        warning: "#ecc94b",
        danger: "#e53e3e",
        info: "#4299e1",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        hard: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "url('/assets/images/hero-pattern.svg')",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      opacity: {
        "15": "0.15",
        "35": "0.35",
        "65": "0.65",
        "85": "0.85",
      },
    },
  },
};

export default config;
