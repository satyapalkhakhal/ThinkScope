import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | ThinkScope - Your Trusted News Source',
  description: 'Learn about ThinkScope, your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports coverage. Our mission, values, and commitment to quality journalism.',
  keywords: 'about ThinkScope, news source, journalism, editorial team, news mission, news values, quality journalism, trusted news',
  openGraph: {
    title: 'About Us | ThinkScope - Your Trusted News Source',
    description: 'Learn about ThinkScope, your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports coverage.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            About NewsBlog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted source for comprehensive news coverage across technology, world affairs, education, lifestyle, and sports.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-accent-500 mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              At ThemeScope, we believe that access to accurate, timely, and comprehensive information is fundamental to an informed society.
              Our mission is to deliver high-quality journalism that empowers readers to make informed decisions and stay connected with the world around them.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We are committed to providing unbiased, fact-based reporting across multiple categories including technology, breaking news,
              world affairs, education, lifestyle, and sports. Our team of experienced journalists and writers work tirelessly to bring
              you the stories that matter most.
            </p>
          </div>
        </section>

        {/* What We Cover */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-center mb-8">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Technology',
                icon: '💻',
                description: 'Latest innovations, AI developments, cybersecurity, and tech industry news.',
              },
              {
                title: 'Breaking News',
                icon: '📰',
                description: 'Real-time updates on current events, politics, and global developments.',
              },
              {
                title: 'World Affairs',
                icon: '🌍',
                description: 'International relations, diplomacy, and global policy analysis.',
              },
              {
                title: 'Education',
                icon: '🎓',
                description: 'Educational trends, learning innovations, and academic developments.',
              },
              {
                title: 'Lifestyle',
                icon: '❤️',
                description: 'Health, wellness, travel, fashion, and modern living trends.',
              },
              {
                title: 'Sports',
                icon: '🏆',
                description: 'Sports news, analysis, athlete profiles, and competition updates.',
              },
            ].map((category, index) => (
              <div key={category.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-accent-500">{category.title}</h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-accent-500 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
                <p className="text-gray-300 text-sm">
                  We prioritize factual reporting and verify information from multiple sources before publication.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Impartiality</h3>
                <p className="text-gray-300 text-sm">
                  Our journalism remains unbiased and presents multiple perspectives on complex issues.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Timeliness</h3>
                <p className="text-gray-300 text-sm">
                  We deliver news as it happens, ensuring our readers stay informed in real-time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-300 text-sm">
                  Our content is available across all platforms and designed for easy consumption.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-accent-500 mb-4">Our Team</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              NewsBlog is powered by a diverse team of experienced journalists, writers, editors, and digital media professionals.
              Our team brings together expertise from various fields to deliver comprehensive coverage across all categories.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We are committed to continuous learning and adaptation, ensuring that our content remains relevant and valuable
              in an ever-changing media landscape. Our editorial standards are guided by principles of journalistic integrity
              and ethical reporting practices.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have questions, feedback, or story ideas? We'd love to hear from you.
              Connect with us through our contact page or follow us on social media for the latest updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary"
              >
                Contact Us
              </a>
              <a
                href="/blog"
                className="btn-secondary"
              >
                Read Our Latest Articles
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
