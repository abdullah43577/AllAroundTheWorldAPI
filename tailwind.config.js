/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./app/*.js"],
  theme: {
    extend: {},
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1300px",
    },
  },
  plugins: [],
};
