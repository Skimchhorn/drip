/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable Tailwind v4
  experimental: {
    turbo: {
      rules: {
        '*.css': ['css-loader', 'postcss-loader'],
      },
    },
  },
};

module.exports = nextConfig;