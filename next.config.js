/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker/container deployments
  output: 'standalone',
}

module.exports = nextConfig
