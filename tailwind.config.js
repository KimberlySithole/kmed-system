/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kmed-green': '#10b981',
        'kmed-dark': '#333333',
      },
    },
  },
  plugins: [],
}
