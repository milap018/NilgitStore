/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#fafafa",
        leaf: "#2f6f4e",
        clay: "#b35c37",
        skysoft: "#d9ecff"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};
