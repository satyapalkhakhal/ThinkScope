import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 bg-gradient-to-br from-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient hero-title">
            Stay Updated with Latest News
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports on ThinkScope
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="btn-primary text-lg px-8 py-3"
            >
              Read Latest Articles
            </Link>
            <Link
              href="#categories"
              className="btn-secondary text-lg px-8 py-3"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">10K+</div>
            <div className="text-gray-400">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">50K+</div>
            <div className="text-gray-400">Readers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">24/7</div>
            <div className="text-gray-400">Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">6</div>
            <div className="text-gray-400">Categories</div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
