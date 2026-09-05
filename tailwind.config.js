/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0B0F17',
        bgSecondary: '#101726',
        bgSurface: '#162032',
        cardBg: '#141C2D',
        accentGreen: '#00F59B',
        accentCyan: '#00E5FF',
        accentPurple: '#A855F7',
      },
    },
  },
  plugins: [],
}
