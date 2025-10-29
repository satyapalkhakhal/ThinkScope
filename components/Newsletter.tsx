'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call - replace with actual newsletter service
    setTimeout(() => {
      if (email && email.includes('@')) {
        setStatus('success');
        setMessage('🎉 Successfully subscribed! Check your email.');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage('Please enter a valid email address.');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1000);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 rounded-3xl p-8 md:p-12 overflow-hidden border border-primary-700">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/10 rounded-2xl mb-6 animate-float">
          <Mail className="h-8 w-8 text-accent-500" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
          Stay in the Loop
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest news, insights, and updates delivered straight to your inbox. No spam, just quality content.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="input flex-1 bg-primary-900/50 border-primary-600 focus:border-accent-500"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-900 border-t-transparent"></span>
                  <span>Subscribing...</span>
                </span>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-success animate-fade-in-up">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-error animate-fade-in-up">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </form>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-accent-500" />
            <span>Free forever</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-accent-500" />
            <span>Unsubscribe anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-accent-500" />
            <span>No spam</span>
          </div>
        </div>
      </div>
    </section>
  );
}
