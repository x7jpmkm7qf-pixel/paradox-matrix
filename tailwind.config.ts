import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b8c1",
          400: "#91919e",
          500: "#737382",
          600: "#5d5d6a",
          700: "#4c4c56",
          800: "#2b2b31",
          900: "#18181b",
          950: "#0e0e10",
        },
        accent: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#6090fa",
          500: "#3b6cf6",
          600: "#2550eb",
          700: "#1d3fd8",
          800: "#1e35af",
          900: "#1e328a",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,16,20,0.04), 0 1px 1px rgba(16,16,20,0.02)",
      },
    },
  },
  plugins: [],
};

export default config;
