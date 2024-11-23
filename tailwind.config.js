/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './src/shared/**/*.{js,jsx,ts,tsx}',
    './src/routes/**/*.{js,jsx,ts,tsx}',
    './src/modules/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e1734b',
      },
    },
  },
  plugins: [],
};
