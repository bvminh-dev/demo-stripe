'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Save session ID to local storage
      localStorage.setItem('latest_session_id', sessionId);
      
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error verifying session:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#dc2626', '#f87171', '#ff9ec0', '#fbbf24'][Math.floor(Math.random() * 4)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10 animate-scale-in">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-lg">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-slide-up">
          Payment <span className="gradient-text">Successful!</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Thank you for subscribing to GlowUp Premium. Your account has been activated and you can now access all premium features.
        </p>
        {session && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-10 text-left animate-slide-up border border-gray-200" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order Details
            </h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-600 font-medium">Session ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-900">{sessionId}</span>
              </div>
              {session.amount_total && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Amount:</span>
                  <span className="font-bold text-2xl text-primary-600">
                    ${(session.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/"
            className="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden hover-lift glow-on-hover transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Go to Dashboard
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 shimmer-effect"></div>
          </Link>
          {sessionId && (
            <Link
              href={`/refund?session_id=${sessionId}`}
              className="px-10 py-4 rounded-2xl font-bold text-lg text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-50 transition-all duration-300 hover-lift"
            >
              Request Refund
            </Link>
          )}
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

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
          </div>
          <div className="text-center relative z-10">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-6"></div>
            <p className="text-xl text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
