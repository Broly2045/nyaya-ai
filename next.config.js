/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Required for Docker
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
