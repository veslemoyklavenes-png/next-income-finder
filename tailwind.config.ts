import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#7D9B7F',
          light: '#A3C1A5',
          dark: '#5A7A5C',
          faint: '#F0F5F0',
        },
        navy: {
          DEFAULT: '#1B3A5C',
          dark: '#122740',
          light: '#2A5280',
        },
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
export default config
