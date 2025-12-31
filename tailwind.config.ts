import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Period filter colors (light and dark)
    'bg-sky-100', 'text-sky-700', 'bg-sky-900/50', 'text-sky-400',
    'bg-amber-100', 'text-amber-700', 'bg-amber-900/50', 'text-amber-400',
    'bg-violet-100', 'text-violet-700', 'bg-violet-900/50', 'text-violet-400',
    // Theme colors
    'bg-blue-500', 'bg-rose-500', 'text-blue-400', 'text-rose-400',
    'text-blue-600', 'text-rose-600', 'bg-blue-100', 'bg-rose-100',
    'bg-blue-900/50', 'bg-rose-900/50',
    // Status colors
    'bg-emerald-100', 'text-emerald-700', 'bg-emerald-900/50', 'text-emerald-400',
    'text-emerald-600', 'bg-green-500', 'bg-green-600', 'text-green-400',
    // Tab colors (for dynamic template strings)
    'text-amber-600', 'bg-slate-600', 'shadow',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          blue: '#3b82f6',
          violet: '#8b5cf6',
          pink: '#ec4899',
          rose: '#f43f5e',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'countdown': 'countdown 5s linear forwards',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        countdown: {
          from: { strokeDashoffset: '0' },
          to: { strokeDashoffset: '100' },
        },
      },
    },
  },
  plugins: [],
}

export default config
