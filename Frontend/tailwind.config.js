/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Arial', 'Helvetica', 'sans-serif'],
        serifDisplay: ['Prata', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        ink: '#27231f',
        muted: '#746f66',
        line: '#e6ddd0',
        blush: '#ead2cc',
        cream: '#f6efe4',
        ivory: '#fffdf9',
        sand: '#eee4d6',
        espresso: '#2d2925',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(67, 54, 38, 0.07)',
        lift: '0 18px 45px rgba(67, 54, 38, 0.12)',
      },
    },
  },
  plugins: [],
}
