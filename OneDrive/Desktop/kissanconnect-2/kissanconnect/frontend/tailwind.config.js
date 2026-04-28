/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7ED',
          100: '#E1EFDB',
          200: '#C3DFB7',
          300: '#A5CF93',
          400: '#87BF6F',
          500: '#2D5016', // Deep Forest Green
          600: '#244010',
          700: '#1B300C',
          800: '#122008',
          900: '#091004',
        },
        secondary: {
          50: '#FEFAF5',
          100: '#FDF5EB',
          200: '#FBEBD7',
          300: '#F9E1C3',
          400: '#F7D7AF',
          500: '#8B9D77', // Sage Green
          600: '#6F7D5F',
          700: '#535E47',
          800: '#373E2F',
          900: '#1C1F18',
        },
        accent: {
          50: '#FEF6EE',
          100: '#FDEDDD',
          200: '#FBDBBB',
          300: '#F9C999',
          400: '#F7B777',
          500: '#F4A261', // Golden Harvest
          600: '#C3824D',
          700: '#92613A',
          800: '#624127',
          900: '#312013',
        },
        success: {
          50: '#EDFBF5',
          100: '#DBF7EB',
          200: '#B7EFD7',
          300: '#93E7C3',
          400: '#6FDFAF',
          500: '#06D6A0', // Mint Green
          600: '#05AB80',
          700: '#048060',
          800: '#025540',
          900: '#012B20',
        },
        warning: {
          50: '#FFFEF5',
          100: '#FFFDEB',
          200: '#FFFBD7',
          300: '#FFF9C3',
          400: '#FFF7AF',
          500: '#FFD60A', // Sunshine Yellow
          600: '#CCAB08',
          700: '#998006',
          800: '#665504',
          900: '#332B02',
        },
        danger: {
          50: '#FCEEE9',
          100: '#F9DDD3',
          200: '#F3BBA7',
          300: '#ED997B',
          400: '#E7774F',
          500: '#E76F51', // Terracotta
          600: '#B95941',
          700: '#8B4331',
          800: '#5C2C20',
          900: '#2E1610',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'premium': '0 10px 40px rgba(45, 80, 22, 0.15)',
        'glow': '0 0 20px rgba(244, 162, 97, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(244, 162, 97, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 162, 97, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(244, 162, 97, 0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
