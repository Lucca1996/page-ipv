/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        body: ["Nanum Gothic"]
      }
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};