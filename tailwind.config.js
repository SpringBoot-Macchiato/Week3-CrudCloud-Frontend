/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilita dark mode con clase 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        text: '#1E293B',
        background: '#F8FAFC',
        border: '#E2E8F0',
        success: '#22C55E',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
