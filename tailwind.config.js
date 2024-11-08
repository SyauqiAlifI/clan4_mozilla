/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#02cc20',
      }
    },
  },
  plugins: [
    require('preline/plugin'),
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
}