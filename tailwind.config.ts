import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6EFE1",
        surface: "#FBF6EA",
        border: { DEFAULT: "#EAE0C8", alt: "#E4D6BA" },
        track: "#EFE7D3",
        ink: "#26301F",
        body: "#5C5A48",
        muted: { DEFAULT: "#928C72", 2: "#847F6C" },
        primary: { DEFAULT: "#2C4A38", hover: "#24402F" },
        accent: "#C1573E",
        gold: { DEFAULT: "#CE9243", dark: "#9A6B3F" },
        sage: "#8FA07E",
        stage: {
          dormant: { DEFAULT: "#9A9080", fg: "#FBF6EA", wash: "#EEE8DA" },
          germinated: { DEFAULT: "#86976A", fg: "#FBF6EA", wash: "#E6EEDB" },
          seedling: { DEFAULT: "#6C9F5C", fg: "#FBF6EA", wash: "#E0EAD3" },
          vegetative: { DEFAULT: "#3E7A4B", fg: "#F6EFE1", wash: "#D9E6CC" },
          budding: { DEFAULT: "#CE9243", fg: "#3B2A0F", wash: "#F5E6C8" },
          flowering: { DEFAULT: "#C1573E", fg: "#FCEEE6", wash: "#F6DCCB" },
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-work-sans)", "sans-serif"],
      },
      fontSize: {
        h1: [
          "36px",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        h2: ["24px", { lineHeight: "1.2", fontWeight: "500" }],
        h3: ["18px", { lineHeight: "1.25", fontWeight: "500" }],
        stat: ["32px", { lineHeight: "1", fontWeight: "500" }],
        caption: [
          "12px",
          { lineHeight: "1.3", fontWeight: "600", letterSpacing: "0.06em" },
        ],
      },
      spacing: {
        4.5: "18px",
      },
      borderRadius: {
        card: "20px",
        "card-sm": "16px",
        "flower-card": "22px",
        thumb: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(38,48,31,0.04), 0 8px 24px -12px rgba(38,48,31,0.12)",
        "card-lg":
          "0 1px 2px rgba(38,48,31,0.05), 0 10px 26px -14px rgba(38,48,31,0.18)",
        "card-hover":
          "0 4px 10px rgba(38,48,31,0.08), 0 22px 36px -16px rgba(38,48,31,0.28)",
        fab: "0 8px 20px -6px rgba(44,74,56,0.5)",
        frame: "0 20px 60px -20px rgba(38,48,31,0.35)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        growBar: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        growDown: {
          from: { height: "0" },
          to: { height: "100%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        growBar: "growBar 0.9s cubic-bezier(.22,.9,.3,1) both",
        growDown: "growDown 1.4s cubic-bezier(.22,.9,.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
