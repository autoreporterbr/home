import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.stellantis.com.br' },
      { protocol: 'https', hostname: 'www.vwnews.com.br' },
      { protocol: 'https', hostname: 'media.chevrolet.com.br' },
      { protocol: 'https', hostname: 'portadenoticia.com' },
    ],
  },
};

export default nextConfig;
