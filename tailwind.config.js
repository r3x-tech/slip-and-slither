/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#F8F8F8",
        secondary: "#1B1A1A",
        tertiary: "#4339FF",
        quaternary: "#FF2768",
        black: "#000000",
        white: "#FFFFFF",
        red: "#FF0000",
        gray: "#A0A0A0",
        lightGray: "#F5F5F7",
        darkerGray: "#86868B",
        input: "#1B1B1F",
        background: "#000000",
        // Custom blacks
        black400: "#2D2D2D",
        black500: "#1B1A1A",
        black600: "#151414",
        black700: "#0D0D0D",
        // Custom greens
        green700: "#00BF63",
        // Custom reds
        red700: "#FF3131",
        // Rex colors
        rexPink: "#FF2F61",
        rexBlue: "#01BDF6",
        rexGreen: "#16F89C",
      },
    },
  },
  plugins: [],
};
