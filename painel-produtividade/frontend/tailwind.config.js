/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta corporativa moderna
        'corporate': {
          'white': '#ffffff',
          'black': '#000000',
          'blue-light': '#3b82f6',
          'blue-lighter': '#dbeafe',
          'gray-light': '#f3f4f6',
          'gray-medium': '#e5e7eb',
          'gray-dark': '#6b7280',
          'gray-darker': '#374151',
        },
        'primary': '#3b82f6',
        'secondary': '#f3f4f6',
        'accent': '#dbeafe',
      },
    },
  },
  plugins: [],
}
