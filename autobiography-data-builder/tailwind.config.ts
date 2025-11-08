import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        primary: {
          50: "#f1f5ff",
          100: "#e1e9ff",
          200: "#c4d4ff",
          300: "#9db6ff",
          400: "#6d8bff",
          500: "#3f5df7",
          600: "#2742d4",
          700: "#1f33a8",
          800: "#1d2f86",
          900: "#1d2c6d"
        },
        accent: "#ff8a65"
      }
    }
  },
  plugins: []
};

export default config;
