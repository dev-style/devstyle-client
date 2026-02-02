/** @type {import('next').NextConfig} */
const nextConfig = (module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2gb' // Maximum allowed value
    }
  },
  httpTimeout: 300000, // Increase timeout to 5 minutes (300000 milliseconds), which is the maximum value
  env: {
    DB_URI:process.env.ONGODB_URI,
    API_URL: process.env.API_URL,
  },
});
module.exports = nextConfig;
