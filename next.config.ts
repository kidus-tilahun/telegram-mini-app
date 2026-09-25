import type { NextConfig } from "next";

// Product/store images are served from the Supabase Storage bucket
// (<project-ref>.supabase.co/storage/v1/...). Derive the hostname from the
// same env var the app uses so next/image can optimize them (WebP/AVIF,
// responsive resizing) instead of failing remote-pattern validation.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname }]
        : []),
    ],
    // AVIF on supporting browsers, WebP fallback everywhere else.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
