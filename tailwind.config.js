
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindCSSIntellisense()],
};
