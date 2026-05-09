/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#D4AF37',
          600: '#AA8C2C',
        },
        black: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2C2C2C',
        }
      }
    },
  },
  plugins: [],
}
