/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

// module.exports = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };