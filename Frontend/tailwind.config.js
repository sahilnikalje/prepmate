/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        "primary":                  "#a3a6ff",
        "secondary":                "#c180ff",
        "background":               "#060e20",
        "surface":                  "#060e20",
        "surface-container-low":    "#091328",
        "surface-container":        "#0f1930",
        "surface-container-high":   "#141f38",
        "surface-container-highest":"#192540",
        "surface-variant":          "#192540",
        "surface-bright":           "#1f2b49",
        "on-surface":               "#dee5ff",
        "on-surface-variant":       "#a3aac4",
        "on-primary":               "#0f00a4",
        "on-primary-fixed":         "#000000",
        "outline":                  "#6d758c",
        "outline-variant":          "#40485d",
        "primary-dim":              "#6063ee",
        "secondary-dim":            "#9c48ea",
        "tertiary-dim":             "#48e5d0",
        "error":                    "#ff6e84",
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', "sans-serif"],
        body:     ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg:      "2rem",
        xl:      "3rem",
        full:    "9999px",
      },
    },
  },
  plugins: [],
}

