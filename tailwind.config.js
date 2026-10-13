/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b14',
          900: '#0c1322',
          850: '#101a2f',
          800: '#15223c',
          700: '#1e3054',
          600: '#2c4372',
        },
        risk: {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#f97316',
          extreme: '#ef4444',
        },
        emergency: {
          sos: '#dc2626',
          hover: '#b91c1c',
        }
      },
    },
  },
  plugins: [],
};

