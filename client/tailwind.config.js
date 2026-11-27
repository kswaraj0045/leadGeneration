/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saas: {
          bg: '#F7F8FA',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
          primary: '#172033',
          secondary: '#667085',
          muted: '#98A2B3',
          accent: '#0F8B8D',
          'accent-hover': '#0D7A7C',
          'accent-subtle': '#F0FDF9',
          'accent-border': '#CCFBF1',
        },
        brand: {
          50: '#F0FDF9',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0F8B8D',
          600: '#0D7A7C',
          700: '#0B686A',
          800: '#095758',
          900: '#063B3C',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.1), 0 1px 2px -1px rgba(16, 24, 40, 0.1)',
        'dropdown': '0 4px 6px -1px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.1)',
      }
    },
  },
  plugins: [],
}
