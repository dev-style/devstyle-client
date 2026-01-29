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
    DB_URI:
      // "mongodb+srv://Dev-scott:Scotty-dev-camer123@devstyle.45jjjdi.mongodb.net/devstyle?retryWrites=true&w=majority",
      // "mongodb+srv://Dev-scott:Scotty-dev-camer123@devstyle.45jjjdi.mongodb.net/devstyle?retryWrites=true&w=majority&appName=devstyle",
      "mongodb+srv://devstyle:gqr7telZFWgoXL8h@cluster0.hunlyyp.mongodb.net/?retryWrites=true&w=majority",
    API_URL: "http://localhost:8000/api/v1",
  },
});
module.exports = nextConfig;
