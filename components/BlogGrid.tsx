'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, User } from 'lucide-react';

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

interface BlogGridProps {
  articles: Article[];
}

export default function BlogGrid({ articles }: BlogGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No articles found.</div>
        <p className="text-gray-500 mt-2">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <BlogCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}

interface BlogCardProps {
  article: Article;
  index: number;
}

function BlogCard({ article, index }: BlogCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <article
        className="card h-full group cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-accent-500 text-primary-900 px-2 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-accent-500 transition-colors">
            {article.title}
          </h2>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>ThinkScope Team</span>
            </div>
            <span className="text-accent-500 font-semibold text-sm group-hover:text-accent-400 transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
