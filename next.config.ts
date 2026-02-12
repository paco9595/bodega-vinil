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
};

export default nextConfig;
