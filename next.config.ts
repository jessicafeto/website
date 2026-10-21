import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Modern formats for the optimised image pipeline. AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  // Calm is fast. Keep the runtime lean.
  reactStrictMode: true,
  // The audit's PDF renderer runs as a plain Node package, and reads its fonts
  // and monograms from disk, so ship those files with the report function.
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    // pdfkit loads its built-in font metrics with a dynamic require that
    // file tracing can't see.
    "/api/audit/report": [
      "./lib/audit/pdf-assets/**",
      "./node_modules/pdfkit/js/standard-fonts/**",
    ],
  },
  // The older Brand Coherence Audit was replaced by the Brand & Growth Audit.
  async redirects() {
    return [
      { source: "/audit", destination: "/brand-growth-audit", permanent: true },
      { source: "/sq/audit", destination: "/sq/brand-growth-audit", permanent: true },
    ];
  },
};

// Wires next-intl into the build and points it at the request config.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
