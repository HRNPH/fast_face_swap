/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        API_URL: process.env.API_URL
    },
};

module.exports = nextConfig;