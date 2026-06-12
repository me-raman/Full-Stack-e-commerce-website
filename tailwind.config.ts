import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Jost", "sans-serif"],
      },
      colors: {
        ivory:   "#F5F0E8",
        noir:    "#0F0F0D",
        gold:    "#C09A52",
        stone:   "#7A756E",
        sand:    "#B5AFA6",
        charcoal:"#2E2E2A",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
