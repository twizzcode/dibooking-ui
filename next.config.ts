import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'pub-f854947dd8db493e8d080eddb7778acc.r2.dev',
          port: '',
          pathname: '/**', // Mengizinkan semua path gambar di domain ini
        },
                {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '/**', // Mengizinkan semua path gambar di domain ini
        },
    ],
  },  
};

export default nextConfig;
