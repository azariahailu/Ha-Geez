import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is opened at 127.0.0.1; without this, client JS does not hydrate.
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["@libsql/client", "libsql"],
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
