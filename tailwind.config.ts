import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mike Sport accent — orange-red (#F1582B).
        brand: {
          50: "#fef3ef",
          100: "#fce1d8",
          200: "#f9c2b0",
          300: "#f59a7d",
          400: "#f37650",
          500: "#f1582b",
          600: "#dd4019",
          700: "#b73116",
          800: "#922a18",
          900: "#772717",
          950: "#400f08",
        },
        // Warm neutrals for the premium corporate look.
        paper: "#faf8f4",
        sand: "#f3eee7",
        cream: "#f3eee7",
        graphite: "#252525",
        charcoal: "#191919",
        gold: "#c99a4a",
        warmborder: "#e4d9ce",
        muted: "#706a63",
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
        "pulse-glow": {
          "0%,100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.06)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "ring-once": {
          "0%": { opacity: "0.5", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.28)" },
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
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "spin-slow": "spin 16s linear infinite",
        float: "float 5s ease-in-out infinite",
        "ring-once": "ring-once 1.8s ease-out 0.4s both",
      },
    },
  },
  plugins: [],
};

export default config;
