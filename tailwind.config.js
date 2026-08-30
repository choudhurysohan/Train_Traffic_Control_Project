/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          900: '#070b14',
          850: '#0c1220',
          800: '#11192e',
          750: '#16203a',
          700: '#1e2c4f',
          600: '#2d3f6d',
          accent: '#38bdf8',
        },
        status: {
          normal: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
          active: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
