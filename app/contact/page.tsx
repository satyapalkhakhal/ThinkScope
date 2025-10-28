import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | ThinkScope',
  description: 'Get in touch with ThinkScope. Send us your questions, feedback, or story ideas via email.',
  keywords: 'contact ThinkScope, email, get in touch, feedback, inquiries',
  openGraph: {
    title: 'Contact Us | ThinkScope',
    description: 'Get in touch with ThinkScope. Send us your questions, feedback, or story ideas.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or story idea? We'd love to hear from you.
          </p>
        </div>

        {/* Email Card */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-2xl mb-6">
              <span className="text-5xl">📧</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">Email Us</h2>
            
            {/* Description */}
            <p className="text-gray-400 mb-8 text-lg">
              Send us an email and we'll get back to you as soon as possible.
            </p>

            {/* Email Display */}
            <div className="bg-primary-800 border border-gray-700 rounded-xl p-6 mb-6">
              <a 
                href="mailto:khakhalsatyapal@gmail.com" 
                className="text-2xl md:text-3xl font-semibold text-accent-500 hover:text-accent-400 transition-colors break-all"
              >
                khakhalsatyapal@gmail.com
              </a>
            </div>

            {/* CTA Button */}
            <a
              href="mailto:khakhalsatyapal@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-primary-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-lg"
            >
              <span className="mr-2">📨</span>
              Send Email
            </a>
          </div>
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
