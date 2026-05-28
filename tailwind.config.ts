import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
