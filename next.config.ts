import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Hi-Tech-map",
  images: { unoptimized: true },
  serverExternalPackages: ["katex"],
};

export default nextConfig;
