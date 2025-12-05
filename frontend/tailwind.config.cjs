const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Lexend', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'Inter', 'sans-serif'],
      },
      colors: {
        midnight: '#05040A',
        neon: {
          cyan: '#00F5FF',
          purple: '#BD00FF',
          magenta: '#FF1CF7',
        },
        glass: 'rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'cyber-gradient':
          'radial-gradient(circle at top, rgba(0,245,255,0.25), transparent 45%), radial-gradient(circle at 20% 20%, rgba(189,0,255,0.25), transparent 35%)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 245, 255, 0.25)',
        'glow-purple': '0 0 30px rgba(189, 0, 255, 0.25)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0,245,255,0.4)' },
          '50%': { boxShadow: '0 0 35px rgba(189,0,255,0.6)' },
        },
        'slide-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-fade': 'slide-fade 0.4s ease forwards',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addComponents, theme }) => {
      addUtilities({
        '.glass-panel': {
          backgroundColor: theme('colors.glass'),
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
        },
        '.neon-border': {
          border: '1px solid rgba(0,245,255,0.4)',
          boxShadow: theme('boxShadow.glow'),
        },
      });
      const displayFont = theme('fontFamily.display');
      const displayFontStr = Array.isArray(displayFont) ? displayFont.join(', ') : String(displayFont || '');
      addComponents({
        '.heading-cyber': {
          fontFamily: displayFontStr,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      });
    }),
  ],
};
