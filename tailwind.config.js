/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        crimson: "#cd2d40ff",
        magnolia: "#E3DBDE",
        rosered: "#cc2d57",
        // "outer-space": "#45555eff",
        "outer-space": "#637681",
        "outer-space-half": "#63768178",
        "outer-space-quarter": "#63768137",
        "outer-space-8th": "#6376811e",
        gunmetal: "#222b30ff",
        "gunmetal-half": "#222b3078",
      },
      fontFamily: {
        righteous: ['"Righteous"'],
        redhat: ['"Red Hat Display"'],
      },
    },
  },
  plugins: [],
};
