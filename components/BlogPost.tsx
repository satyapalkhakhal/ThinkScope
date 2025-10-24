'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import BlogGrid from '@/components/BlogGrid';
import { categories } from '@/data/categories';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  categoryId?: string;
}

interface BlogPostProps {
  article: Article;
}

export default function BlogPost({ article }: BlogPostProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get related articles (same category, excluding current article)
  const relatedArticles = categories
    .find(cat => cat.id === article.categoryId)?.articles
    .filter(a => a.id !== article.id)
    .slice(0, 3) || [];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${article.title}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-accent-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-accent-500 transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300 font-medium line-clamp-1">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-accent-500 text-primary-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="text-sm">ThinkScope Team</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-gray-400 hover:text-accent-500 hover:bg-accent-500/10'
                }`}
                aria-label="Bookmark article"
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <div className="relative">
                <button className="p-2 rounded-full text-gray-400 hover:text-accent-500 hover:bg-accent-500/10 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 bg-primary-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-accent-500 hover:bg-primary-700 rounded"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-accent-500 hover:bg-primary-700 rounded"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-accent-500 hover:bg-primary-700 rounded"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full h-auto object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            {article.excerpt}
          </p>

          {/* Article body content - expanded version */}
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              In today's rapidly evolving digital landscape, staying informed about the latest developments
              across various sectors has become more crucial than ever. This comprehensive article explores
              the key aspects and implications of recent advancements in {article.category.toLowerCase()},
              providing readers with valuable insights and analysis.
            </p>

            <h2 className="text-2xl font-bold text-accent-500 mt-8 mb-4">Understanding the Impact</h2>

            <p>
              The developments we're witnessing today represent a significant shift in how we approach
              modern challenges. From technological innovations to global policy changes, each advancement
              carries profound implications for individuals, businesses, and society as a whole.
            </p>

            <blockquote className="border-l-4 border-accent-500 pl-6 py-2 my-6 bg-primary-800/50 rounded-r-lg">
              <p className="text-gray-300 italic">
                "The future belongs to those who believe in the beauty of their dreams and work
                tirelessly to turn them into reality."
              </p>
              <cite className="text-accent-500 text-sm mt-2 block">- Eleanor Roosevelt</cite>
            </blockquote>

            <h2 className="text-2xl font-bold text-accent-500 mt-8 mb-4">Key Takeaways</h2>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Comprehensive understanding of current trends and their implications</li>
              <li>Expert analysis of potential future developments</li>
              <li>Practical insights for staying ahead in a rapidly changing world</li>
              <li>Strategic considerations for individuals and organizations</li>
            </ul>

            <p>
              As we continue to navigate through these transformative times, it's essential to maintain
              a balanced perspective while embracing the opportunities that lie ahead. The information
              presented here serves as a foundation for making informed decisions and staying prepared
              for future challenges and opportunities.
            </p>
          </div>
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-700 pt-8 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Share this article:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Tags:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary-800 text-gray-300 rounded-full text-xs">
                  {article.category}
                </span>
                <span className="px-2 py-1 bg-primary-800 text-gray-300 rounded-full text-xs">
                  News
                </span>
                <span className="px-2 py-1 bg-primary-800 text-gray-300 rounded-full text-xs">
                  Analysis
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-700 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.slug}`}>
                  <div className="card group cursor-pointer">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        width={400}
                        height={250}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-accent-500 font-semibold mb-2 block">
                        {relatedArticle.category}
                      </span>
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-accent-500 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(relatedArticle.date).toLocaleDateString()}</span>
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
