// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // increase Server Action payload cap from the 1 MB default
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // ← choose a value > your largest upload (~6.7 MB)
    },
  },
  // if you also use Pages-API routes elsewhere, you can bump their parser too:
  api: {
    bodyParser: {
      sizeLimit: "50mb", // optional, only for pages/api/*
    },
  },
};

export default nextConfig;