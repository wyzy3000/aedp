/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        savanna: {
          50: '#fdf8ee',
          100: '#f9edcd',
          200: '#f2d997',
          300: '#e9c160',
          400: '#e2ac3a',
          500: '#d4911f',
          600: '#b87118',
          700: '#925317',
          800: '#78431a',
          900: '#64381a',
        },
        earth: {
          50: '#f5f0eb',
          100: '#e8ddd2',
          200: '#d3bca7',
          300: '#bb9478',
          400: '#a87355',
          500: '#9a6043',
          600: '#844e38',
          700: '#6b3c2e',
          800: '#5a332a',
          900: '#4d2d26',
        },
        forest: {
          50: '#f0f5ee',
          100: '#ddebd8',
          200: '#bad7b3',
          300: '#8cba84',
          400: '#65985c',
          500: '#4a7d41',
          600: '#376332',
          700: '#2c5029',
          800: '#264425',
          900: '#203922',
        },
        sky: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
          dark: '#1d4ed8',
        },
        glass: 'rgba(255,255,255,0.07)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'wave': 'wave 1.2s ease-in-out infinite',
        'wave2': 'wave 1.2s ease-in-out 0.2s infinite',
        'wave3': 'wave 1.2s ease-in-out 0.4s infinite',
        'wave4': 'wave 1.2s ease-in-out 0.6s infinite',
        'wave5': 'wave 1.2s ease-in-out 0.8s infinite',
        'grass': 'grassSway 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        grassSway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-savanna': 'linear-gradient(135deg, #0d1a0f 0%, #1a2e1c 40%, #0f1f11 100%)',
        'gradient-earth': 'linear-gradient(135deg, #1c1208 0%, #2d1f0e 100%)',
        'gradient-sky': 'linear-gradient(180deg, #0c1829 0%, #0f2744 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },
    },
  },
  plugins: [],
}
