/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images.ctfassets.net', 's1.ticketm.net'],
  },
}

module.exports = nextConfig