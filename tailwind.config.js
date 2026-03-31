/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#060608',
        'surface': '#111115',
        'text': '#f0f0f2',
        'text-muted': '#77777a',
        'accent': '#6c5ce7',
        'accent-light': '#a29bfe',
        // Neo-Brutalism colors
        'brutal-yellow': '#FFE53B',
        'brutal-pink': '#FF006E',
        'brutal-cyan': '#00F5FF',
        'brutal-lime': '#39FF14',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #f0f0f2',
        'brutal-accent': '4px 4px 0px #6c5ce7',
        'brutal-yellow': '4px 4px 0px #FFE53B',
        'brutal-pink': '4px 4px 0px #FF006E',
        'brutal-cyan': '4px 4px 0px #00F5FF',
        'brutal-lime': '4px 4px 0px #39FF14',
        'brutal-lg': '6px 6px 0px #f0f0f2',
      },
      borderWidth: {
        'brutal': '3px',
      },
      animation: {
        'spin': 'spin 0.8s linear infinite',
        'scrollPulse': 'scrollPulse 2s ease-in-out infinite',
      },
      keyframes: {
        scrollPulse: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.4', transform: 'scaleY(0.6)' },
        },
      },
    },
  },
  plugins: [],
}