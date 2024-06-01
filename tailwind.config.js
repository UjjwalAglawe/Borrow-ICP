/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue': 'hsla(245, 27%, 27%, 0.5)',
      },
    },
  },
  plugins: [],
}

