'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Verify the session with your backend
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for subscribing to GlowUp Premium. Your account has been activated and you can now access all premium features.
        </p>
        {session && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Session ID:</span>
                <span className="font-mono text-xs">{sessionId}</span>
              </div>
              {session.amount_total && (
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">
                    ${(session.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="bg-gray-200 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
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
        <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

