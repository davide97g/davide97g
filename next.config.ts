import type { NextConfig } from "next";

// The profile repo is served from https://davide97g.github.io/davide97g when
// deployed to GitHub Pages, so the CI job sets NEXT_PUBLIC_BASE_PATH=/davide97g.
// Locally, and on a host that serves the site from the root, it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
