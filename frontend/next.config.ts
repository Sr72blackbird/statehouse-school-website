import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "statehouse-school-website.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  // Optimize production builds
  compress: true,
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
