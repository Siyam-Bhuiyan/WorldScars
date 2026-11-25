/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070706", // the void
        char: "#121110", // raised surfaces
        ash: "#262420", // rules, borders
        smoke: "#55524a", // muted borders / disabled
        dim: "#9c978a", // secondary text
        bone: "#ece6d8", // primary text, paper
        blood: "#c0160f", // dried accent
        ember: "#ff3527", // living accent: light, pulse, glow
        rust: "#4a0905", // deep accent
      },
      fontFamily: {
        display: ["Anton", "Impact", '"Arial Narrow"', "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", '"Times New Roman"', "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Consolas", "monospace"],
        typed: ['"Special Elite"', '"Courier New"', "Courier", "monospace"],
      },
      letterSpacing: {
        file: "0.22em",
      },
    },
  },
  plugins: [],
};
