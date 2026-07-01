/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-green': '#2E7D32',
        'brand-light-green': '#4CAF50',
        'brand-earth': '#8D6E63',
      }
    },
  },
  plugins: [],
}
