/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        'start-gradient': `linear-gradient(to-br, ${theme('colors.start-gradient')}, ${theme('colors.end-gradient')})`,
      }),
      colors: {
        'start-gradient': '#ffd89b',
        'end-gradient': '#19547b',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
