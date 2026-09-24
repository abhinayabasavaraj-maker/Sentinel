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
        navy: {
          950: '#070c14',
          900: '#0b1220',
          850: '#0e1626',
          800: '#111a2e',
          750: '#15213b',
          700: '#1c2c4c',
          600: '#263b66',
          500: '#334d80',
          400: '#4d6fa9',
        },
        cyber: {
          cyan: '#22d3ee',
          blue: '#2563eb',
          sky: '#38bdf8',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#22c55e',
          emerald: '#10b981',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
