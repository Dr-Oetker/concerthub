/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images.ctfassets.net', 's1.ticketm.net'], // Add any other domains you need
  },
}

module.exports = nextConfig