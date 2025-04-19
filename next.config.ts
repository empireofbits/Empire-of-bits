import type { Configuration } from 'webpack';

const nextConfig = {
  // Remove the static export option if you're using API routes
  // output: 'export',  // Remove this line

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
