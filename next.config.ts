import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hi_tech_map",
  images: { unoptimized: true },
  serverExternalPackages: ["katex"],
};

export default nextConfig;
