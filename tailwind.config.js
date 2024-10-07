import { trailui } from "@trail-ui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@trail-ui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "Roboto"],
      },
      fontSize: {
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "20px",
        "5xl": "40px",
      },
      lineHeight: {
        sm: "18px",
        base: "20px",
        lg: "24px",
        xl: "30px",
        "5xl": "48px",
      },
    },
  },
  darkMode: "selector",
  plugins: [trailui()],
};
