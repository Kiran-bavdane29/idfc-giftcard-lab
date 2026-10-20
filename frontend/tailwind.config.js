/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        idfc: {
          red: '#990000',
          redDark: '#6d0000',
          redLight: '#c8102e',
          charcoal: '#2b2b2b',
          gold: '#c9a227',
          goldLight: '#e8c95a',
          cream: '#f6f4f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -6px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
