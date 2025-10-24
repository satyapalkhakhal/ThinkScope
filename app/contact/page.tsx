import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | ThinkScope - Get in Touch',
  description: 'Contact ThinkScope for inquiries, feedback, story tips, or business partnerships. Reach out to our editorial team, advertising department, or technical support.',
  openGraph: {
    title: 'Contact Us | ThinkScope - Get in Touch',
    description: 'Contact ThinkScope for inquiries, feedback, story tips, or business partnerships.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with our team for inquiries, feedback, or story ideas.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-accent-500 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-400 text-sm mb-2">General inquiries and editorial questions</p>
                    <a href="mailto:info@newsblog.com" className="text-accent-500 hover:text-accent-400 transition-colors">
                      info@newsblog.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Story Tips</h3>
                    <p className="text-gray-400 text-sm mb-2">Have a news tip or story idea?</p>
                    <a href="mailto:tips@newsblog.com" className="text-accent-500 hover:text-accent-400 transition-colors">
                      tips@newsblog.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Inquiries</h3>
                    <p className="text-gray-400 text-sm mb-2">Partnerships and advertising</p>
                    <a href="mailto:business@newsblog.com" className="text-accent-500 hover:text-accent-400 transition-colors">
                      business@newsblog.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone Support</h3>
                    <p className="text-gray-400 text-sm mb-2">Monday - Friday, 9 AM - 6 PM EST</p>
                    <a href="tel:+15551234567" className="text-accent-500 hover:text-accent-400 transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-gray-400 text-sm mb-2">Visit us at our headquarters</p>
                    <address className="text-accent-500 not-italic">
                      123 News Street<br />
                      Media City, MC 12345<br />
                      United States
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-accent-500 mb-6">Send us a Message</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="story">Story Tip</option>
                    <option value="business">Business/Advertising</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="w-4 h-4 text-accent-500 bg-primary-800 border-gray-700 rounded focus:ring-accent-500 focus:ring-2"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-300">
                    I agree to the{' '}
                    <a href="/privacy" className="text-accent-500 hover:text-accent-400 transition-colors">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/terms" className="text-accent-500 hover:text-accent-400 transition-colors">
                      Terms of Service
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-accent-500 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How quickly do you respond to inquiries?</h3>
                <p className="text-gray-400 text-sm">
                  We typically respond to all inquiries within 24-48 hours during business days (Monday-Friday, 9 AM - 6 PM EST).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I submit a story tip anonymously?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, you can submit story tips anonymously. We respect your privacy and will only use the information you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Do you accept guest articles or contributions?</h3>
                <p className="text-gray-400 text-sm">
                  We occasionally accept guest contributions from qualified writers. Please send your pitch to our editorial team with writing samples and relevant credentials.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How can I advertise on NewsBlog?</h3>
                <p className="text-gray-400 text-sm">
                  For advertising inquiries, please contact our business development team at business@newsblog.com or call our sales department.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media CTA */}
        <section className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20">
            <h2 className="text-2xl font-bold mb-4">Follow Us for Updates</h2>
            <p className="text-gray-300 mb-6">
              Stay connected with NewsBlog on social media for the latest news, behind-the-scenes content, and community updates.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="w-12 h-12 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary-800 hover:bg-accent-500 hover:text-primary-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
