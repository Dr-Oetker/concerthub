/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images.ctfassets.net', 's1.ticketm.net'],
  },
  // Ignore the scripts folder during build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('scripts/');
    }
    return config;
  },
}

module.exports = nextConfig