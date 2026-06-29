import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mike Sport accent — warm orange (#F58220).
        brand: {
          50: "#fef4ec",
          100: "#fde4d0",
          200: "#fac79e",
          300: "#f8a96c",
          400: "#f69544",
          500: "#f58220",
          600: "#dd6c12",
          700: "#b8550f",
          800: "#8f4210",
          900: "#73360f",
          950: "#3f1c07",
        },
        // Warm neutrals for the premium corporate look.
        paper: "#f7f7f5",
        sand: "#ecebe6",
        graphite: "#252525",
        charcoal: "#151515",
        gold: "#c99a4a",
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
        "blob-1": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(24px,-30px) scale(1.08)" },
          "66%": { transform: "translate(-18px,18px) scale(0.95)" },
        },
        "blob-2": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(-28px,20px) scale(1.05)" },
          "66%": { transform: "translate(22px,-16px) scale(0.92)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "scale-in": "scale-in 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-left": "slide-in-left 0.4s ease-out both",
        "grow-bar": "grow-bar 0.6s ease-out both",
        "blob-1": "blob-1 18s ease-in-out infinite",
        "blob-2": "blob-2 22s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
