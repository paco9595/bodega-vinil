import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.discogs.com',
      },
      {
        protocol: 'https',
        hostname: 'st.discogs.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify avatars
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Spotify avatars
      },
    ],
  },
  env: {
    BROWSERSLIST_IGNORE_OLD_DATA: "true",
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  },
};

export default nextConfig;
