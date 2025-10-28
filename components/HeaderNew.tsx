'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Bell, User, ChevronRight } from 'lucide-react';

// Breaking news ticker items
const breakingNews = [
  'Breaking: Major announcement expected from tech giant tomorrow',
  'Stock markets reach all-time high',
  'Global leaders to meet at climate summit next week',
];

// Main navigation items
const mainNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'Business', href: '/category/business' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Entertainment', href: '/category/entertainment' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-rotate breaking news
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white text-sm py-2 border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-accent-500">BREAKING:</span>
              <div className="overflow-hidden h-5">
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${tickerIndex * 100}%)` }}
                >
                  {breakingNews.map((news, index) => (
                    <div key={index} className="h-5 leading-5">
                      {news}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-primary-850 shadow-md border-b border-primary-700 ${isScrolled ? 'py-2' : 'py-3'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                <span className="text-primary-950 font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">ThinkScope</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for news..."
                  className="w-full px-4 py-2 bg-primary-800 border border-primary-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-accent-500 text-primary-950 rounded-r-md hover:bg-accent-400 focus:outline-none transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-accent-500 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="hidden md:flex items-center space-x-1 px-4 py-2 bg-accent-500 text-primary-950 rounded-md hover:bg-accent-400 font-medium transition-colors">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-400 hover:text-accent-500 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1 overflow-x-auto mt-3 pb-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-accent-500 whitespace-nowrap transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-primary-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 pt-16 pb-3 space-y-1">
          {mainNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between px-3 py-3 text-base font-medium text-gray-300 hover:text-accent-500 hover:bg-primary-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.name}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-primary-700">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-950 bg-accent-500 hover:bg-accent-400 transition-colors">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
