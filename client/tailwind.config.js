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
        skylineBlue: {
          50: "#e8f1fc",
          100: "#d1e3f8",
          200: "#a3c7f1",
          300: "#76aaeb",
          400: "#488ee4",
          500: "#1a72dd",
          600: "#155bb1",
          700: "#104485",
          800: "#0a2e58",
          900: "#05172c",
        },
        navy: {
          50: "#eaebee",
          100: "#d4d6dd",
          200: "#aaadbb",
          300: "#7f849a",
          400: "#555b78",
          500: "#2a3256",
          600: "#222845",
          700: "#191e34",
          800: "#111422",
          900: "#080a11",
        },
      },
    },
    screens: {
      mobileLandscape: "480px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
  },
  plugins: [],
};
