/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '560px',
      md: '768px',
      lg: '1060px',
      xl: '1200px',
      xxl: '1440px',
      xxxl: '1600px'
    },
    fontFamily: {
      'lato': ['Lato', 'Sans-serif'],
      'montserrat': ['Montserrat', 'Sans-serif']
    },
    fontSize: {
      'h1': '1.3rem',
      'p': '.9rem',
      'h1-lg': '3rem',
    },
    extend: {
      colors: {
        brownText: '#582C21',
        beige: '#DAAE89',
        whiteBg: '#F2F2F2',
      },
      backgroundImage: {
        'bg': "url('./images/bg.png')",
        'bg-header': "url('./images/bg-header.png')",
        'bg-cart': "url('./images/bg-cart.png')",
      },
    }
  },
  plugins: [],
}

