/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f4', 100: '#fce7eb', 200: '#f9d0d9',
          300: '#f4a8b9', 400: '#ed7693', 500: '#e04a71',
          600: '#ce2d5b', 700: '#ae2049', 800: '#921d40',
          900: '#7d1c3b', 950: '#450a1c',
        },
        luxury: {
          gold: '#C9A96E', beige: '#F5F0EB', dark: '#1A1A2E',
          charcoal: '#2D2D44', cream: '#FAF8F5',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
