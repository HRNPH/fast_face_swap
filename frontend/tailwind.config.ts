import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      "primary": "#5500ff",
      "primary-light": "#5500ffe1",
      "primary-dark": "#4c00e4ff",
      "secondary": "#9e72e0fd",
      "foreground": "#1a1a1a",
      "foreground-light": "#565555ff",
      "background": "#ffffff",
      "cutoff": "#ffffff",
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
