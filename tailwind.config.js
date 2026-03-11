// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         primary: '#3b82f6',
//         secondary: '#8b5cf6',
//       },
//       backdropBlur: {
//         md: '12px',
//       },
//       boxShadow: {
//         glow: '0 0 30px rgba(59, 130, 246, 0.3)',
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c5af3',
        'primary-light': '#a78bfa',
        'primary-dark': '#6d40e7',
        secondary: '#e94d8c',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7c5af3 0%, #4facfe 100%)',
        'cta-gradient':  'linear-gradient(135deg, #7c5af3 0%, #e94d8c 100%)',
        'card-gradient': 'linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)',
      },
      boxShadow: {
        'card':    '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'glow':    '0 4px 20px rgba(124,90,243,0.25)',
        'glow-lg': '0 8px 40px rgba(124,90,243,0.3)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};