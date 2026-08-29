import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0f",
          panel: "#111827",
          cyan: "#00f0ff",
          magenta: "#ff00e5",
          purple: "#7b2ff7",
          lime: "#a7ff3c"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(0, 240, 255, 0.24)",
        magenta: "0 0 32px rgba(255, 0, 229, 0.24)"
      },
      animation: {
        glitch: "glitch 2.5s infinite",
        float: "float 7s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        glitch: {
          "0%, 100%": { textShadow: "0 0 14px rgba(0,240,255,.6)" },
          "33%": { textShadow: "2px 0 #ff00e5, -2px 0 #00f0ff" },
          "66%": { textShadow: "-2px 0 #ff00e5, 2px 0 #00f0ff" }
        }
      }
    }
  },
  plugins: []
};

export default config;

