/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'polara-blue': '#1e3a8a',
        'polara-purple': '#7c3aed',
        'polara-pink': '#ec4899',
      },
      fontFamily: {
        'opendyslexic': ['OpenDyslexic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

