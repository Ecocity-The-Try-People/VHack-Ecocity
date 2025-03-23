const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Custom font
        sans: ["Roboto", "sans-serif"], // Override the default sans-serif font
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
  ],
};

export default config;