/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241908",
        paper: "#fffaf0",
        leaf: "#9a6a00",
        clay: "#b8860b",
        skysoft: "#fff1b8",
        gold: {
          50: "#fffaf0",
          100: "#fff2c6",
          200: "#ffe08a",
          300: "#ffd052",
          400: "#f5b51b",
          500: "#d99a00",
          600: "#a87500",
          700: "#7a5300",
          800: "#4f3600"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(168, 117, 0, 0.12)"
      }
    }
  },
  plugins: []
};
