/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        background: '#000000', 
        formBackground: '#C3f73a', 
        primaryText: '#ffffff', 
        secondaryText: '#68b684', 
        action: '#094d92', 
        hoverAction: '#C3f73a',
      },
    },
  },
  plugins: [],
}


