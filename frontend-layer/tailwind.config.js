/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0B0F1D',
        primary: '#11D9B9',
        secondary: '#8F96A8',
        default: '#5D6882',
        disabled: '#CACFDC',
        navy: '#37538D',
        'dark-navy': '#283550',
        'dark-blue': '#161F32',
        'very-dark-blue': '#0F1322',
        pink: '#E069FF',
        grey: '#434343',
        'lighter-grey': '#AEAEAE',
        'light-grey': '#CACFDC',
        'dark-grey': '#343B4B',
        'darker-grey': '#9196A3',
        danger: '#D04452',
      },
      fontSize: {
        ['2xs']: '10px',
      },
    },
  },
  plugins: [],
}
