// next.config.ts
import type { Configuration } from 'webpack';

const nextConfig = {
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Don't resolve 'net' and 'tls' modules on the client-side
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