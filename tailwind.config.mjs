/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0d12',
          elevated: '#12151d',
        },
        fg: {
          DEFAULT: '#e8eaf2',
          muted: '#9aa3b5',
          subtle: '#5d6678',
        },
        border: {
          DEFAULT: '#1d2230',
          strong: '#2c3346',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          alt: '#22d3ee',
        },
      },
      fontFamily: {
        sans: ['Geist Variable', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
