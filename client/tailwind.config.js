/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik"],
        kantumruy: ["Kantumruy+Pro"],
        moul: ["Moul"],
      },
      colors: {
        skylineBlue: "#1A72DD",
        navy: "#2A3256",
      },
    },
  },
  plugins: [],
};
