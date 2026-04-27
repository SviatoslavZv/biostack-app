import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloudinary.images-iherb.com',
        pathname: '/**', // Разрешаем все пути на этом домене
      },
    ],
  },
};

export default nextConfig;