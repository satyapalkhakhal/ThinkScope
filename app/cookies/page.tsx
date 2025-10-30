import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | ThinkScope',
  description: 'Learn about how ThinkScope uses cookies to improve your browsing experience and provide personalized content.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-6 text-accent-400">Cookie Policy</h1>
        
        <p className="text-gray-300 text-lg mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">What Are Cookies</h2>
          <p className="text-gray-300 leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and provide a better user experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            ThinkScope uses cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security features.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously (Google Analytics).</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad campaign performance (Google AdSense).</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences for a better user experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Types of Cookies We Use</h2>
          
          <div className="space-y-4">
            <div className="bg-primary-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-accent-400">1. Strictly Necessary Cookies</h3>
              <p className="text-gray-300">
                These cookies are essential for the website to function and cannot be disabled. They include session cookies 
                and authentication tokens for admin users.
              </p>
            </div>

            <div className="bg-primary-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-accent-400">2. Performance and Analytics Cookies</h3>
              <p className="text-gray-300 mb-2">
                We use Google Analytics to collect anonymous information about how visitors use our site:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4">
                <li>Pages visited and time spent on each page</li>
                <li>Traffic sources and referral information</li>
                <li>Device and browser information</li>
                <li>Geographic location (country/city level)</li>
              </ul>
            </div>

            <div className="bg-primary-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-accent-400">3. Advertising Cookies</h3>
              <p className="text-gray-300">
                We use Google AdSense to display advertisements. These cookies help deliver relevant ads and measure 
                ad performance. Third-party advertisers may also use cookies to track your browsing activity across websites.
              </p>
            </div>

            <div className="bg-primary-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-accent-400">4. Functional Cookies</h3>
              <p className="text-gray-300">
                These cookies remember your preferences, such as theme settings, language preferences, and other customization options.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We work with third-party service providers who may also set cookies on your device:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Google Analytics:</strong> Web analytics service to understand user behavior</li>
            <li><strong>Google AdSense:</strong> Advertising platform to display relevant ads</li>
            <li><strong>Google Tag Manager:</strong> Tag management system for tracking and analytics</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            These third parties have their own privacy policies and cookie policies. We recommend reviewing them:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mt-2">
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Google Privacy Policy</a></li>
            <li><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Google Cookie Policy</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Managing Cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            You have the right to control and manage cookies. Here are your options:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 text-white">Browser Settings</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
            <li>Block all cookies</li>
            <li>Block third-party cookies only</li>
            <li>Delete cookies when you close your browser</li>
            <li>Set exceptions for specific websites</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-white">Browser-Specific Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">Microsoft Edge</a></li>
          </ul>

          <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg mt-4">
            <p className="text-yellow-200">
              <strong>Note:</strong> Blocking or deleting cookies may affect your experience on ThinkScope and prevent 
              certain features from working properly.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Opt-Out Options</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            You can opt out of specific cookie types:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <strong>Google Analytics:</strong> Install the{' '}
              <a 
                href="https://tools.google.com/dlpage/gaoptout" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent-400 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
            </li>
            <li>
              <strong>Google Ads:</strong> Visit{' '}
              <a 
                href="https://adssettings.google.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent-400 hover:underline"
              >
                Google Ad Settings
              </a>
              {' '}to manage ad personalization
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Changes to This Cookie Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, 
            operational, or regulatory reasons. We encourage you to review this page periodically for the latest 
            information on our cookie practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          <div className="bg-primary-800 p-4 rounded-lg mt-4">
            <p className="text-gray-300">
              <strong className="text-white">Email:</strong>{' '}
              <a href="mailto:privacy@thinkscope.in" className="text-accent-400 hover:underline">
                privacy@thinkscope.in
              </a>
            </p>
            <p className="text-gray-300 mt-2">
              <strong className="text-white">Contact Page:</strong>{' '}
              <a href="/contact" className="text-accent-400 hover:underline">
                thinkscope.in/contact
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            For more information about how we handle your data, please review:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <a href="/privacy" className="text-accent-400 hover:underline">Privacy Policy</a>
              {' '}- How we collect, use, and protect your personal information
            </li>
            <li>
              <a href="/terms" className="text-accent-400 hover:underline">Terms of Service</a>
              {' '}- The terms and conditions for using ThinkScope
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
