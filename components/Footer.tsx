import Link from 'next/link';
import { Mail } from 'lucide-react';
import { categoryService } from '@/lib/services';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default async function Footer() {
  // Fetch categories from Supabase
  const { data: categories } = await categoryService.getAll();
  return (
    <footer className="bg-primary-800 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📰</span>
              <span className="text-xl font-bold text-accent-500">ThinkScope</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for news and information across multiple categories.
              Stay informed with our comprehensive coverage of current events.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-accent-500 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-accent-500 transition-colors text-sm"
                >
                  All Categories
                </Link>
              </li>
              {(categories || []).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug || category.id}`}
                    className="text-gray-400 hover:text-accent-500 transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-accent-500 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-accent-500 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <a href="mailto:khakhalsatyapal@gmail.com" className="hover:text-accent-500 transition-colors">
                  khakhalsatyapal@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ThinkScope. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-accent-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-accent-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
