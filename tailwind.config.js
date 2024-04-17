/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*/*.{html,js,ejs}'],
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