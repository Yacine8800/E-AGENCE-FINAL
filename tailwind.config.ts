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
        eco: "#94C33E",
        primary: "#EC4F48",
        smallText: "#8F8F8F",
        orange: "#F7942E",
        gris: "#EFEAEA",
        grisHeader: "#F9F9F9",
        noir: "#201F1F",
        vert: "#56C1B5",
        vertFonce: "#1F7A70",
        rouge: "#EC4F48",
        colorbaseSidebar: "#FBF1DE",
        colorsecondSidebar: "#C0F4EE",
        colorLogo: "#FBF1DE",
        jaune: "#FFBE20",
      },
      backgroundImage: {
        "gradient-orange": "linear-gradient(to right, #EFAE35, #F7942E)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out 1s infinite",
        "float-slow": "floatSlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
