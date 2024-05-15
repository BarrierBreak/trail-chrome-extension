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
        sourceCode: ["Source Code Pro", "monospace"],
      },
    },
  },
  darkMode: "selector",
  plugins: [trailui()],
};
