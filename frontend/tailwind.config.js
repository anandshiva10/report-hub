/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        muted: "#5d6978",
        line: "#d9e0e8",
        surface: "#f7f9fb",
        brand: "#0f766e",
        accent: "#b45309"
      }
    }
  },
  plugins: []
};
