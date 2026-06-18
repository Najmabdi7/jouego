/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.gamepix.com' },
      { protocol: 'https', hostname: '**.gamedistribution.com' },
      { protocol: 'https', hostname: '**.gamemonetize.com' },
    ],
  },
}

module.exports = nextConfig
