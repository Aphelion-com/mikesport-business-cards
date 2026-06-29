import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mike Sport accent — orange.
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        // Mike Sport ink — near-black for sidebars / dark surfaces.
        ink: {
          50: "#f6f6f7",
          100: "#e7e7e9",
          200: "#d1d1d6",
          300: "#a9aab2",
          400: "#7c7d87",
          500: "#5d5e69",
          600: "#494a53",
          700: "#3c3d44",
          800: "#27282d",
          900: "#18191d",
          950: "#0c0d0f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(12, 13, 15, 0.25)",
        soft: "0 1px 3px rgba(12, 13, 15, 0.06), 0 8px 24px -16px rgba(12, 13, 15, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "grow-bar": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "scale-in": "scale-in 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-left": "slide-in-left 0.4s ease-out both",
        "grow-bar": "grow-bar 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
