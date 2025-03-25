// tailwind.config.mjs
export default {
  darkMode: 'class', // This enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Roboto", "sans-serif"], 
      },
    },
  },
  plugins: [
    // Add Tailwind plugins here if needed
  ],
}