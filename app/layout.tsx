import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThinkScope - Stay Updated with Latest News',
  description: 'Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports. Stay informed with our comprehensive coverage.',
  keywords: 'news, technology, world affairs, education, lifestyle, sports, breaking news, current events',
  authors: [{ name: 'ThinkScope Team' }],
  creator: 'ThinkScope',
  publisher: 'ThinkScope',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thinkscope.in'),
  openGraph: {
    title: 'ThinkScope - Stay Updated with Latest News',
    description: 'Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports.',
    url: 'https://thinkscope.in',
    siteName: 'ThinkScope',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ThinkScope - Latest News and Updates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkScope - Stay Updated with Latest News',
    description: 'Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports.',
    images: ['/og-image.jpg'],
    creator: '@thinkscope',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ThinkScope',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ThinkScope',
    url: 'https://thinkscope.in',
    logo: 'https://thinkscope.in/icon-512x512.png',
    sameAs: [
      'https://twitter.com/thinkscope',
      // Add more social media profiles here
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: 'https://thinkscope.in/contact',
    },
  };

  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ThinkScope',
    url: 'https://thinkscope.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://thinkscope.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00ff88" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ThinkScope" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2757390342181644" crossOrigin="anonymous"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XBZK7E1G01"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XBZK7E1G01');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-primary-900 text-white antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
