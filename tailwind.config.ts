import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0E1A',
        'navy-deep': '#0D1B2A',
        surface: {
          DEFAULT: '#111827',
          alt: '#1C2333',
        },
        electric: '#00E5FF',
        volt: '#AAFF00',
        warning: '#FFB800',
        danger: '#FF3D57',
        success: '#00E676',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        electric: '0 0 20px rgba(0,229,255,0.25)',
        volt: '0 0 20px rgba(170,255,0,0.25)',
        danger: '0 0 20px rgba(255,61,87,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
