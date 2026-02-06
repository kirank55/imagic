import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-0089335ae4cd4a079105dd0b02ab91da.r2.dev",
      },
    ],
  },
};

export default nextConfig;
