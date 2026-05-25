/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jade': '#2d8a6e',
        'ink': '#1a1a2e',
        'gold': '#c9a96e',
        'parchment': '#f5e6ca',
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
      }
    },
  },
  plugins: [],
};
