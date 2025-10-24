'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: Article[];
}

interface CategoryCarouselProps {
  category: Category;
  priority?: boolean;
}

export default function CategoryCarousel({ category, priority = false }: CategoryCarouselProps) {
  const swiperRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  const iconMap: { [key: string]: any } = {
    Laptop: '💻',
    Newspaper: '📰',
    Globe: '🌍',
    GraduationCap: '🎓',
    Heart: '❤️',
    Trophy: '🏆',
  };

  return (
    <section className="mb-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{iconMap[category.icon]}</span>
          <h2 className="text-2xl font-bold text-accent-500">{category.name}</h2>
        </div>
        <Link
          href={`/category/${category.id}`}
          className="text-accent-500 hover:text-accent-400 font-semibold flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: `.swiper-button-prev-${category.id}`,
            nextEl: `.swiper-button-next-${category.id}`,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-4"
        >
          {category.articles.map((article, index) => (
            <SwiperSlide key={article.id}>
              <ArticleCard article={article} priority={priority && index < 3} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`swiper-button-prev-${category.id} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary-800/80 backdrop-blur-sm border border-accent-500 text-accent-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:text-primary-900 ${
            isHovered ? 'opacity-100 translate-x-2' : 'opacity-0 translate-x-0'
          }`}
          aria-label="Previous articles"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          className={`swiper-button-next-${category.id} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary-800/80 backdrop-blur-sm border border-accent-500 text-accent-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:text-primary-900 ${
            isHovered ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-0'
          }`}
          aria-label="Next articles"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <article className="carousel-card h-full group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={250}
            priority={priority}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-accent-500 text-primary-900 px-2 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-accent-500 transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
