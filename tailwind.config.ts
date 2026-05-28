import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d8ebff",
          200: "#b9dcff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e3a8a",
          900: "#172554",
        },
        amber: {
          soft: "#fff7ed",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)",
        card: "0 14px 35px rgba(30, 64, 175, 0.10)",
        float: "0 20px 60px rgba(15, 23, 42, 0.16)",
      },
      backgroundImage: {
        app: "radial-gradient(circle at top left, #dbeafe 0, transparent 34%), radial-gradient(circle at 85% 10%, #ffedd5 0, transparent 30%), linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)",
        hero: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #f97316 145%)",
      },
    },
  },
  plugins: [],
};

export default config;
