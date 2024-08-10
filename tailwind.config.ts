import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{html,vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Golos Text", "sans-serif"],
        pixel: ["Pixelify Sans", "sans-serif"],
        emoji: ["Noto Color Emoji", "sans-serif"],
      },
      animation: {
        loader: "loader-slide 1s linear infinite",
        copied: "copied-fade 3s",
      },
      colors: {
        bg: "rgb(42, 45, 52)",
        "bg-secondary": "rgb(121, 129, 134)",
        primary: "rgb(0, 157, 220)",
        "primary-accent": "rgb(103, 97, 168)",
        secondary: "rgb(219, 208, 83)",
        "secondary-accent": "rgb(242, 100, 48)",
      },
      dropShadow: {
        "mark-glow-x": "0 0 8px rgba(0, 157, 220,0.5)",
        "mark-glow-x-intense": "0 0 16px rgba(0, 157, 220,0.75)",
        "mark-glow-o": "0 0 8px rgba(219, 208, 83, 0.5)",
        "mark-glow-o-intense": "0 0 16px rgba(219, 208, 83, 0.75)",
      },
      keyframes: {
        "loader-slide": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-50%)",
          },
        },
        "copied-fade": {
          "0%": {
            opacity: 0,
            transform: "translateY(16px)",
          },
          "25%, 75%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(-16px)",
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        ".transition-allow-discrete": {
          "transition-behavior": "allow-discrete",
        },
      });
    }),
    ({ addVariant }) => {
      addVariant("starting", "@starting-style");
    },
  ],
};
