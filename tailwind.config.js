/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Pretendard", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#151B28",
        muted: "#697386",
        panel: "#F5F7FA",
        line: "#E6EAF0",
      },
      boxShadow: {
        soft: "0 14px 45px rgba(21, 27, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
