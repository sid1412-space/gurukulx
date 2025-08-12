
import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

const pwaConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDevelopment,
    dynamicStartUrl: false, // Prevents caching the start URL, which can be stale.
    workboxOptions: {
      navigateFallback: null, // Disables fallback for navigation requests.
    },
});

export default isDevelopment ? nextConfig : pwaConfig(nextConfig);
