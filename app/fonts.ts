import localFont from "next/font/local";

/**
 * Self-hosted type — no runtime request, deterministic builds, fast LCP.
 * Two families, one job each (Brand Book §13). Latin subset only.
 * Cormorant Garamond ships as a variable font (weight axis 300–700);
 * one file for roman, one for italic. Lato is static (Light/Regular/Bold).
 */
export const cormorant = localFont({
  src: [
    {
      path: "./fonts/cormorant-variable.woff2",
      weight: "300 600",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-variable-italic.woff2",
      weight: "300 600",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const lato = localFont({
  src: [
    { path: "./fonts/lato-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/lato-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/lato-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lato",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Helvetica Neue", "sans-serif"],
});
