/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./public/templates/*.html", "./public/js/pages/*.js", "./public/js/services/domService.js"],
  theme: {
    fontFamily: { Inter: "Inter, system-ui" },
    extend: {}
  },
  plugins: []
};
