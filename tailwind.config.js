/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      colors: {
        eco: "#94C33E",
        primary: "#EC4F48",
        "primary-dark": "#D83A33",
        smallText: "#8F8F8F",
        orange: "#F7942E",
        gris: "#EFEAEA",
        grisHeader: "#F9F9F9",
        noir: "#201F1F",
        vert: "#56C1B5",
        vertFonce: "#1F7A70",
        bleuNuit: "#1a1b3f",
        rouge: "#EC4F48",
        jaune: "#FFBE20",
        colorbaseSidebar: "#FBF1DE",
        colorsecondSidebar: "#C0F4EE",
        colorLogo: "#FBF1DE",
      },
      backgroundImage: {
        "gradient-orange": "linear-gradient(to right, #EFAE35, #F7942E)",
        "gradient-prepaid": "linear-gradient(to right, #27c3b2, #56c1b5)",
        "gradient-postpaid": "linear-gradient(to right, #FFA755, #EC4F48)",
      },
      keyframes: {
        "electric-pulse-1": {
          "0%": { transform: "scale(0)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "electric-pulse-2": {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "80%": { transform: "scale(1.5)", opacity: "0.3" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        "electric-pulse-1": "electric-pulse-1 0.5s ease-out",
        "electric-pulse-2": "electric-pulse-2 0.7s ease-out",
      },
    },
  },
  plugins: [],
};
