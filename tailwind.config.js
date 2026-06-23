/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Calm dark sidebar / technical-guide palette
        ink: {
          950: "#080b10",
          900: "#0c1118",
          800: "#121925",
          700: "#1a2433",
          600: "#243044",
        },
        accent: {
          DEFAULT: "#2563eb",
          soft: "#3b82f6",
          deep: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        panel:
          "0 1px 2px rgba(16, 24, 40, 0.05), 0 8px 24px -8px rgba(16, 24, 40, 0.12)",
        lift: "0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 32px -12px rgba(16, 24, 40, 0.18)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.375rem",
      },
    },
  },
  plugins: [],
};
