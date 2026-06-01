/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // STEP-1: All colors use CSS variables
        // This means every bg-background, text-on-surface etc.
        // automatically switches when we change the CSS variables on :root
        background:                  'rgb(var(--c-bg) / <alpha-value>)',
        surface:                     'rgb(var(--c-surface) / <alpha-value>)',
        'surface-container-low':     'rgb(var(--c-surface-low) / <alpha-value>)',
        'surface-container-high':    'rgb(var(--c-surface-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--c-surface-highest) / <alpha-value>)',
        'surface-variant':           'rgb(var(--c-surface-variant) / <alpha-value>)',
        'surface-bright':            'rgb(var(--c-surface-bright) / <alpha-value>)',
        primary:                     'rgb(var(--c-primary) / <alpha-value>)',
        secondary:                   'rgb(var(--c-secondary) / <alpha-value>)',
        'on-primary':                'rgb(var(--c-on-primary) / <alpha-value>)',
        'on-primary-fixed':          'rgb(var(--c-on-primary-fixed) / <alpha-value>)',
        'on-surface':                'rgb(var(--c-on-surface) / <alpha-value>)',
        'on-surface-variant':        'rgb(var(--c-on-surface-variant) / <alpha-value>)',
        'outline-variant':           'rgb(var(--c-outline-variant) / <alpha-value>)',
        'outline':                   'rgb(var(--c-outline) / <alpha-value>)',
        error:                       'rgb(var(--c-error) / <alpha-value>)',
        'error-container':           'rgb(var(--c-error-container) / <alpha-value>)',
        'tertiary-dim':              'rgb(var(--c-tertiary-dim) / <alpha-value>)',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     './index.html',
//     './src/**/*.{js,jsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         "primary":                  "#a3a6ff",
//         "secondary":                "#c180ff",
//         "background":               "#060e20",
//         "surface":                  "#060e20",
//         "surface-container-low":    "#091328",
//         "surface-container":        "#0f1930",
//         "surface-container-high":   "#141f38",
//         "surface-container-highest":"#192540",
//         "surface-variant":          "#192540",
//         "surface-bright":           "#1f2b49",
//         "on-surface":               "#dee5ff",
//         "on-surface-variant":       "#a3aac4",
//         "on-primary":               "#0f00a4",
//         "on-primary-fixed":         "#000000",
//         "outline":                  "#6d758c",
//         "outline-variant":          "#40485d",
//         "primary-dim":              "#6063ee",
//         "secondary-dim":            "#9c48ea",
//         "tertiary-dim":             "#48e5d0",
//         "error":                    "#ff6e84",
//       },
//       fontFamily: {
//         headline: ['"Plus Jakarta Sans"', "sans-serif"],
//         body:     ["Inter", "sans-serif"],
//       },
//       borderRadius: {
//         DEFAULT: "1rem",
//         lg:      "2rem",
//         xl:      "3rem",
//         full:    "9999px",
//       },
//     },
//   },
//   plugins: [],
// }

