import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ThinkScope - User Agreement',
  description: 'ThinkScope Terms of Service: Read our user agreement, terms of use, and conditions for accessing our news platform and services.',
  keywords: 'terms of service, user agreement, terms and conditions, legal terms, acceptable use policy, user rights, service terms',
  openGraph: {
    title: 'Terms of Service | ThinkScope - User Agreement',
    description: 'ThinkScope Terms of Service: Read our user agreement, terms of use, and conditions for accessing our news platform.',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: January 24, 2025
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <div className="card p-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using ThinkScope ("the Service"), you agree to be bound by these Terms of Service ("Terms").
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service. By using ThinkScope,
                you represent that you are at least 13 years old and have the legal capacity to enter into these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                ThinkScope is a digital news platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>News articles and content across multiple categories</li>
                <li>Breaking news updates and current events coverage</li>
                <li>Educational and informational content</li>
                <li>User interaction features and community engagement</li>
                <li>Newsletter and subscription services</li>
                <li>Advertising and promotional content</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">User Accounts and Registration</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To access certain features of the Service, you may need to register for an account. When you register, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We reserve the right to terminate accounts that violate these Terms or engage in inappropriate behavior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Acceptable Use Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute harmful, offensive, or inappropriate content</li>
                <li>Impersonate others or provide false information</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use automated tools to access or scrape content</li>
                <li>Engage in spamming, harassment, or abusive behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Content and Intellectual Property</h2>

              <h3 className="text-lg font-semibold mb-3">Our Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content on ThinkScope, including articles, images, videos, and graphics, is protected by copyright and other intellectual property laws.
                You may not reproduce, distribute, or create derivative works without explicit permission.
              </p>

              <h3 className="text-lg font-semibold mb-3">User-Generated Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                By submitting content to ThinkScope (comments, feedback, etc.), you grant us a non-exclusive, royalty-free, worldwide license to use,
                display, and distribute your content in connection with the Service.
              </p>

              <h3 className="text-lg font-semibold mb-3">DMCA and Copyright</h3>
              <p className="text-gray-300 leading-relaxed">
                If you believe your copyright has been infringed, please contact us at <a href="mailto:legal@thinkscope.in" className="text-accent-500 hover:text-accent-400 transition-colors">legal@thinkscope.in</a>.
                We respond to valid DMCA takedown notices in accordance with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy,
                which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Third-Party Links and Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                ThinkScope may contain links to third-party websites or integrate with third-party services. We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>The availability or accuracy of third-party services</li>
                <li>The content, privacy policies, or practices of third parties</li>
                <li>Any damages or losses caused by third-party services</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Your interactions with third parties are solely between you and such third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Advertising and Monetization</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                ThinkScope displays advertisements and may participate in affiliate marketing programs. These activities help support our operations:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Advertisements are clearly labeled and distinguished from editorial content</li>
                <li>We comply with advertising industry standards and regulations</li>
                <li>Third-party advertisers are responsible for their own content and practices</li>
                <li>You may encounter targeted advertising based on your browsing activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Disclaimers and Limitations</h2>

              <h3 className="text-lg font-semibold mb-3">Service "As Is"</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
                We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
              </p>

              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the fullest extent permitted by law, ThinkScope shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited to loss of profits, data, use, or other intangible losses.
              </p>

              <h3 className="text-lg font-semibold mb-3">Accuracy of Information</h3>
              <p className="text-gray-300 leading-relaxed">
                While we strive for accuracy, we do not warrant that all information on ThinkScope is complete, accurate, or current.
                News content may contain errors, and we are not liable for any reliance on such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless ThinkScope, its officers, directors, employees, and agents from any claims,
                damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, your right to use the Service will cease immediately. All provisions of these Terms that by their nature should survive termination shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Governing Law and Dispute Resolution</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration
                in accordance with the rules of the American Arbitration Association.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You agree that any legal action must be brought within one (1) year after the claim or cause of action arises.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide
                at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.
                If you do not agree to the new terms, you must stop using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Severability</h2>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions
                of these Terms will remain in effect. These Terms operate to the fullest extent permissible by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-primary-800 p-6 rounded-lg">
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> <a href="mailto:legal@thinkscope.in" className="text-accent-500 hover:text-accent-400 transition-colors">legal@thinkscope.in</a></p>
                  <p><strong>Mail:</strong> ThinkScope Legal Team<br />123 News Street<br />Media City, MC 12345<br />United States</p>
                  <p><strong>Phone:</strong> <a href="tel:+15551234567" className="text-accent-500 hover:text-accent-400 transition-colors">+1 (555) 123-4567</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-accent-500 mb-4">Entire Agreement</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms constitute the entire agreement between you and ThinkScope regarding the use of the Service
                and supersede all prior agreements and understandings, whether written or oral.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
