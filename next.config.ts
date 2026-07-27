import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Modern formats for the optimised image pipeline. AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  // Calm is fast. Keep the runtime lean.
  reactStrictMode: true,
};

// Wires next-intl into the build and points it at the request config.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
