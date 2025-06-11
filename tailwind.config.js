import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        coffee: {
          primary: "#6F4E37", // Coffee brown
          secondary: "#8B5A2B", // Darker brown
          accent: "#D4A017", // Golden accent
          neutral: "#3C2F2F", // Dark neutral
          "base-100": "#F5F5F5", // Light background
          "base-200": "#E0E0E0", // Slightly darker background
          "base-300": "#C0C0C0", // Border color
          "base-content": "#1F1F1F", // Text color
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
};
