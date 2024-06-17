/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue': 'hsla(245, 27%, 27%, 0.5)',
        'custom-nav': 'rgba(17, 22, 39, 1)',
        'lighterCustomColor': 'rgba(32, 39, 54, 1)',
      },
    },
  },
  plugins: [],
}

