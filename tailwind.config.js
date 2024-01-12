/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        crimson: "#cd2d40ff",
        magnolia: "#E3DBDE",
        rosered: "#cc2d57",
        "outer-space": "#45555eff",
        gunmetal: "#222b30ff",
      },
      fontFamily: {
        righteous: ['"Righteous"'],
        redhat: ['"Red Hat Display"'],
      },
    },
  },
  plugins: [],
};
