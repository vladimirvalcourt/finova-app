import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
