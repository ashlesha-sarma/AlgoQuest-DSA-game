/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { pixel: ['"VT323"', 'monospace'] },
      colors: {
        brown:  { DEFAULT: '#5d4037', dark: '#3e2723', light: '#8d6e63', pale: '#d7ccc8' },
        cream:  { DEFAULT: '#fff9c4', light: '#fffde7' },
        pxgreen:{ DEFAULT: '#4caf50', dark: '#2e7d32', light: '#81c784' },
      },
    },
  },
  plugins: [],
};
