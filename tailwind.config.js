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
      'sans-serif': 'futura-pt',
      'sans-serif': 'acumin-pro-wide'
    },
    extend: {
      colors: {
        darkBG: '#181818',
        colorBG: '#1ECECE',
        taintedBG: '#111111',
        lightText: '#F4F4F4',
        normalText: '#afafaf',
        darkerText: '#606060',
        darkText: '#242424',
        baseColor: '#1ECECE',
        manaClub: '#a809e5',
        vertex: '#ea3397',
        deft: '#20e062',
        dub: '#ffd930'
      }
    }
  },
  plugins: [],
}

