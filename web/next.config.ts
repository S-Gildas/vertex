import type { NextConfig } from "next";

for (const name of [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_READ_TOKEN",
] as const) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
