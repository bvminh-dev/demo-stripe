'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10 animate-scale-in">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-lg">
          <svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-slide-up">
          Payment <span className="gradient-text">Cancelled</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Your payment was cancelled. No charges were made to your account. If you have any questions, please contact our support team.
        </p>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-10 animate-slide-up border border-yellow-200" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-left">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700">
                Our support team is here to assist you. Feel free to reach out if you encountered any issues or have questions about our pricing plans.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/"
            className="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden hover-lift glow-on-hover transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Try Again
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            <div className="absolute inset-0 shimmer-effect"></div>
          </Link>
          <Link
            href="/"
            className="px-10 py-4 rounded-2xl font-bold text-lg text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50 transition-all duration-300 hover-lift"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
