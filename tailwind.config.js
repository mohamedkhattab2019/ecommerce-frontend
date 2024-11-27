/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E293B", // Dark blue-gray for backgrounds
        secondary: "#334155", // Slightly lighter gray for components
        tertiary: "#64748B", // Accent color for text
        textPrimary: "#FFFFFF", // White text
        textSecondary: "#CBD5E1", // Muted text
      },
    },
  },
  plugins: [],
}

