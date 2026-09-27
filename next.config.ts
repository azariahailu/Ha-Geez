import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is opened at 127.0.0.1; without this, client JS does not hydrate.
  allowedDevOrigins: ["127.0.0.1"],
  // The workbook is read from disk the first time an empty database is filled.
  outputFileTracingIncludes: {
    "*": ["./data/geez-lexicon.xlsx"],
    "/*": ["./data/geez-lexicon.xlsx"],
    "/api/*": ["./data/geez-lexicon.xlsx"],
  },
  serverExternalPackages: ["@libsql/client", "libsql"],
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
