/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f9f9f9',
          100: '#f2f2f2',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        cobalt: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1A56DB',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3163',
        },
        amber: {
          100: '#fef3c7',
          400: '#fbbf24',
          600: '#d97706',
        },
        emerald: {
          100: '#d1fae5',
          600: '#059669',
        },
        rose: {
          100: '#ffe4e6',
          600: '#e11d48',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'stagger-1': 'slideUp 0.4s 0.05s ease forwards',
        'stagger-2': 'slideUp 0.4s 0.1s ease forwards',
        'stagger-3': 'slideUp 0.4s 0.15s ease forwards',
        'stagger-4': 'slideUp 0.4s 0.2s ease forwards',
        'spin-slow': 'spin 2s linear infinite',
        'draw': 'draw 1.2s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        draw: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
