/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'),
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
}