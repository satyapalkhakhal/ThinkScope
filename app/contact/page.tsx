import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | ThinkScope',
  description: 'Get in touch with ThinkScope. Send us your questions, feedback, or story ideas.',
  keywords: 'contact ThinkScope, get in touch, feedback, inquiries',
  openGraph: {
    title: 'Contact Us | ThinkScope',
    description: 'Get in touch with ThinkScope. Send us your questions, feedback, or story ideas.',
    type: 'website',
  },
};

export default function ContactPage() {
  // ContactPage Schema
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact ThinkScope',
    description: 'Get in touch with ThinkScope for questions, feedback, or story ideas.',
    url: 'https://thinkscope.in/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'ThinkScope',
      url: 'https://thinkscope.in',
      logo: 'https://thinkscope.in/favicon_io/android-chrome-512x512.png',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: 'English',
        areaServed: 'Worldwide',
      },
    },
  };

  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or story idea? Fill out the form below and we'll get back to you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ContactForm />
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20">
            <h3 className="text-xl font-semibold mb-3">Response Time</h3>
            <p className="text-gray-300">
              We typically respond within <span className="text-accent-500 font-semibold">24-48 hours</span> during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
