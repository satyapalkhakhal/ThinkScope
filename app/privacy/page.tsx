import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ThinkScope - Your Data Protection',
  description: 'ThinkScope Privacy Policy: Learn how we collect, use, and protect your personal information. Our commitment to data privacy and user rights.',
  keywords: 'privacy policy, data protection, personal information, user privacy, data security, GDPR, privacy rights, data collection',
  openGraph: {
    title: 'Privacy Policy | ThinkScope - Your Data Protection',
    description: 'ThinkScope Privacy Policy: Learn how we collect, use, and protect your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  // WebPage schema for privacy policy
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    description: 'ThinkScope Privacy Policy: Learn how we collect, use, and protect your personal information.',
    url: 'https://thinkscope.in/privacy',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'ThinkScope',
      url: 'https://thinkscope.in',
    },
    datePublished: '2025-01-24',
    dateModified: '2025-01-24',
  };

  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: January 24, 2025
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <div className="card p-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                At ThinkScope ("we," "our," or "us"), we are committed to protecting your privacy and personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
                our website, use our services, or interact with us.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using ThinkScope, you agree to the collection and use of information in accordance with this policy.
                We will not use or share your information except as described in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Information We Collect</h2>

              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may collect personally identifiable information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Name, email address, and contact information when you register or contact us</li>
                <li>Demographic information for content personalization</li>
                <li>Communication preferences and subscription settings</li>
                <li>Any other information you choose to provide through forms or communications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you visit ThinkScope, we automatically collect certain information about your device and usage:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>IP address, browser type, and operating system</li>
                <li>Pages visited, time spent on pages, and referral sources</li>
                <li>Device information and screen resolution</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide, maintain, and improve our services and content</li>
                <li>Personalize your experience and deliver relevant content</li>
                <li>Process transactions and manage user accounts</li>
                <li>Send newsletters, updates, and promotional communications</li>
                <li>Analyze usage patterns and improve website functionality</li>
                <li>Comply with legal obligations and protect our rights</li>
                <li>Prevent fraud, abuse, and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist in operating our website (under strict confidentiality agreements)</li>
                <li>When required by law or to protect our rights and safety</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>To protect against fraud, security threats, or illegal activity</li>
                <li>With advertising partners for targeted advertising (in anonymized or aggregated form)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies, web beacons, and similar technologies to enhance your browsing experience:
              </p>

              <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Advertising Cookies:</strong> Used for targeted advertising and marketing</li>
              </ul>

              <p className="text-gray-300 leading-relaxed">
                You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure data storage and backup procedures</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information,
                we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation of data processing</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our website may contain links to third-party websites or integrate with third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Social media platforms and sharing buttons</li>
                <li>Analytics and advertising services</li>
                <li>Content delivery networks</li>
                <li>Payment processors (if applicable)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                ThinkScope is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure that appropriate safeguards are in place to protect your information during such transfers,
                in compliance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
                the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-primary-800 p-6 rounded-lg">
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> <a href="mailto:privacy@thinkscope.in" className="text-accent-500 hover:text-accent-400 transition-colors">privacy@thinkscope.in</a></p>
                  <p><strong>Mail:</strong> ThinkScope Privacy Team<br />123 News Street<br />Media City, MC 12345<br />United States</p>
                  <p><strong>Phone:</strong> <a href="tel:+15551234567" className="text-accent-500 hover:text-accent-400 transition-colors">+1 (555) 123-4567</a></p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
