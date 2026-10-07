import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  },
  async redirects() {
    return [{ source: "/", destination: "/es", permanent: false }];
  },
};

export default nextConfig;
