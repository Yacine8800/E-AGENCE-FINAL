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
    },
  },
  plugins: [],
};

export default config;
