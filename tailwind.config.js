/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        primary: '#C3f73a',          // Verde claro
        secondary: '#68b684',        // Verde oscuro
        accent: '#094d92',           // Azul
        neutral: '#000000',          // Negro
        background: '#ffffff',       // Blanco
      },
    },
  },
  plugins: [],
}


