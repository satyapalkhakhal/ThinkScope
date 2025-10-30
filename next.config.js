/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mrvapygtxktrgilxqgqr.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  async redirects() {
    return [
      // WWW to non-WWW redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.thinkscope.in',
          },
        ],
        destination: 'https://thinkscope.in/:path*',
        permanent: true,
      },
      // Index.html redirects
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      // Catch-all for any path with .html extension
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
      // Catch-all for any path with .php extension
      {
        source: '/:path*.php',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Cache static assets (images, fonts, etc.)
        source: '/(.*)\\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CSS and JS files
        source: '/(.*)\\.(css|js)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache HTML pages with revalidation
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=120, stale-while-revalidate=300',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
