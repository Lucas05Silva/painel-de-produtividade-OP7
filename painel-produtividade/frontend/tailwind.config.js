/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'dark': '#0f172a',
        'light': '#f8fafc',
        'slate-dark': '#1e293b',
      },
      backgroundColor: {
        'dark-bg': '#0f172a',
        'card-dark': '#1e293b',
      }
    },
  },
  plugins: [],
}
