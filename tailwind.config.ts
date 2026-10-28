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
        // Brand night-navy and flame orange, matching the fanpage cover.
        night: {
          700: "#1a2440",
          800: "#111a30",
          900: "#0a1124",
          950: "#060a17",
        },
        flame: {
          300: "#ffc27a",
          400: "#ffa54a",
          500: "#ff8a1f",
          600: "#f07208",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,16,20,0.04), 0 1px 1px rgba(16,16,20,0.02)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -20px rgba(37,80,235,0.45)",
        flame: "0 10px 30px -8px rgba(255,138,31,0.6)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        draw: { from: { strokeDashoffset: "600" }, to: { strokeDashoffset: "0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        rise: "rise 0.7s ease-out both",
        draw: "draw 1.8s ease-out 0.4s both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
