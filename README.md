# ThinkScope - Modern News Platform

A modern, SEO-friendly news website built with Next.js 14, React, and Tailwind CSS. At ThinkScope, we believe that access to accurate, timely, and comprehensive information is fundamental to an informed society. Our mission is to deliver high-quality journalism that empowers readers to make informed decisions and stay connected with the world around them.

## 🚀 Features

- **Modern React/Next.js Architecture**: Built with Next.js 14 for optimal performance and SEO
- **Dark Theme Design**: Sleek, modern dark theme optimized for readability
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Category-Based Content**: Organized content across Technology, News, World Affairs, Education, Lifestyle, and Sports
- **Interactive Carousels**: Smooth, touch-enabled carousels for browsing articles
- **SEO Optimized**: Comprehensive SEO setup with meta tags, structured data, and sitemaps
- **PWA Ready**: Progressive Web App features with manifest and offline capabilities
- **AdSense Ready**: Includes all necessary pages for Google AdSense approval
- **Performance Optimized**: Lazy loading, image optimization, and efficient code splitting

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: React with TypeScript
- **Carousel**: Swiper.js
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Deployment**: Optimized for static export and various hosting platforms

## 📁 Project Structure

```
ThinkScope/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── blog/              # Blog section
│   │   └── [slug]/        # Dynamic blog posts
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy Policy
│   ├── terms/             # Terms of Service
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── sitemap.ts         # Dynamic sitemap
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Homepage hero section
│   ├── CategoryCarousel.tsx # Article carousels
│   ├── BlogGrid.tsx       # Blog listing grid
│   ├── BlogPost.tsx       # Individual blog post
│   └── ScrollToTop.tsx    # Scroll to top button
├── data/                  # Static data
│   └── categories.ts      # Article categories and content
├── public/                # Static assets
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ThinkScope
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Static Export (for hosting on platforms like Netlify)

```bash
npm run build
npm run export
```

## 🎨 Customization

### Adding New Categories

1. Add category data to `data/categories.ts`
2. Update navigation in `components/Header.tsx`
3. Add category page in `app/category/[id]/page.tsx`

### Modifying Content

- **Articles**: Update `data/categories.ts` with new articles
- **Pages**: Modify page components in the `app/` directory
- **Styling**: Customize `app/globals.css` and `tailwind.config.js`

### SEO Optimization

The project includes comprehensive SEO features:
- Dynamic meta tags for each page
- Structured data (JSON-LD) ready
- XML sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card support

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-enabled carousels
- Mobile-first navigation
- Optimized images with Next.js Image component
- PWA features for app-like experience

## 🔧 AdSense Integration

The website includes all necessary pages for Google AdSense approval:
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)
- About Us (`/about`)
- Contact (`/contact`)
- Comprehensive sitemap and robots.txt

## 🌟 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting by Next.js
- **Lazy Loading**: Components and images load as needed
- **Caching**: Efficient caching strategies
- **Bundle Analysis**: Ready for bundle analysis tools

## 🔒 Security

- Content Security Policy (CSP) headers
- Secure headers configuration
- Input validation and sanitization
- XSS protection measures

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Contact: info@thinkscope.in

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, React, and modern web technologies for ThinkScope.
