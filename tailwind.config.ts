import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#0A0A0F",
          900: "#0D0D1A",
          800: "#111128",
          700: "#1A1A3E",
        },
        neon: {
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
        },
        bio: {
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        cell: {
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
        },
      },
      animation: {
        "vote-pop": "vote-pop 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        "vote-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(74, 222, 128, 0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(74, 222, 128, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
