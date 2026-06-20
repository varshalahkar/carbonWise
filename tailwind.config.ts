import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        emeraldFresh: "#50C878",
        jade: "#00A36C",
        sea: "#2E8B57",
        viridian: "#097969",
        mint: "#98FB98",
        seafoam: "#9FE2BF",
        aquaMist: "#96DED1",
        turquoise: "#40E0D0",
        tealGlow: "#40B5AD",
        forest: "#023020",
        moss: "#355E3B",
        olive: "#454B1B",
        cyanAccent: "#7DF9FF",
        aquamarine: "#7FFFD4",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 80px rgba(2, 48, 32, 0.28)",
        glow: "0 0 50px rgba(125, 249, 255, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
