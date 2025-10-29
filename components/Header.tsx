'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Newspaper, Search, ChevronDown } from 'lucide-react';
import { categoryService, Category } from '@/lib/services';

// Static navigation items (non-category pages)
const staticNavigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await categoryService.getAll();
        if (data && !error) {
          setCategories(data.slice(0, 8)); // Limit to 8 categories
        }
      } catch (error) {
        console.error('Error loading categories for navbar:', error);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsCategoriesOpen(false);
    };
    if (isCategoriesOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoriesOpen]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-br from-primary-800 to-primary-900 ${
        isScrolled
          ? 'shadow-xl border-b border-gray-800/50 backdrop-blur-lg'
          : 'backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="p-2 bg-accent-500/10 rounded-lg group-hover:bg-accent-500/20 transition-colors">
              <Newspaper className="h-6 w-6 text-accent-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
              ThinkScope
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {staticNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                  isActive(item.href)
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-primary-800'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-accent-500 rounded-full"></span>
                )}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoriesOpen(!isCategoriesOpen);
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname?.startsWith('/category') || pathname === '/categories'
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-primary-800'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-primary-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="p-2">
                    <Link
                      href="/categories"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-accent-500 hover:bg-primary-700 rounded-lg transition-colors"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      All Categories
                    </Link>
                    <div className="h-px bg-gray-700 my-2"></div>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-accent-500 hover:bg-primary-700 rounded-lg transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-primary-800 transition-colors group"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline-flex items-center px-2 py-0.5 text-xs font-mono bg-primary-700 border border-gray-600 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-[calc(100vh-4rem)] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-4 bg-primary-800/90 backdrop-blur-lg border-t border-gray-700/50">
          <div className="space-y-1">
            {staticNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-primary-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Categories Section */}
            <div className="pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              <Link
                href="/categories"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Categories
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block px-4 py-3 rounded-lg text-base text-gray-300 hover:text-white hover:bg-primary-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-primary-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center p-4 border-b border-gray-700">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-3 text-gray-400 hover:text-white text-sm"
              >
                ESC
              </button>
            </form>
            <div className="p-4 text-sm text-gray-400">
              Press <kbd className="px-2 py-1 bg-primary-700 border border-gray-600 rounded text-xs">Enter</kbd> to search
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
