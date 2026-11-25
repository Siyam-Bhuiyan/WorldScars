/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a09", // page black
        char: "#141412", // raised surfaces
        ash: "#2b2a26", // rules, borders
        smoke: "#57544c", // muted borders / disabled
        dim: "#9c978a", // secondary text
        bone: "#e8e3d6", // primary text, paper
        blood: "#c0160f", // the one accent
        rust: "#5e0b07", // dried blood, deep accent
      },
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Consolas", "monospace"],
        read: ['"Newsreader"', "Georgia", '"Times New Roman"', "serif"],
        typed: ['"Special Elite"', '"Courier New"', "Courier", "monospace"],
      },
      letterSpacing: {
        file: "0.22em",
      },
    },
  },
  plugins: [],
};
