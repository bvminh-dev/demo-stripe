"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface RefundResult {
  success: boolean;
  refund?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reason: string | null;
    created: number;
  };
  error?: {
    message: string;
  };
}

function RefundContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RefundResult | null>(null);
  const [refundHistory, setRefundHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load session_id from URL params or local storage
  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      // Also save to local storage
      localStorage.setItem("latest_session_id", sessionIdParam);
    } else {
      // Try to load from local storage
      const storedSessionId = localStorage.getItem("latest_session_id");
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    }
  }, [searchParams]);

  // Auto-load refund history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      const loadHistory = async () => {
        setLoadingHistory(true);
        try {
          const response = await fetch(`/api/refund?session_id=${sessionId}`);
          const data = await response.json();
          if (data.refunds) {
            setRefundHistory(data.refunds);
          }
        } catch (error) {
          console.error("Error loading refund history:", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      loadHistory();
    }
  }, [sessionId]);

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          amount: amount ? parseFloat(amount) : null,
          reason: reason || null,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Clear form on success
        setAmount("");
        setReason("");
        // Refresh refund history
        loadRefundHistory();
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: { message: error.message || "An error occurred" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRefundHistory = async () => {
    if (!sessionId) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/refund?session_id=${sessionId}`);
      const data = await response.json();

      if (data.refunds) {
        setRefundHistory(data.refunds);
      }
    } catch (error) {
      console.error("Error loading refund history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSessionId = e.target.value;
    setSessionId(newSessionId);
    setRefundHistory([]);
    // Save to local storage when user manually enters session ID
    if (newSessionId) {
      localStorage.setItem("latest_session_id", newSessionId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md shadow-lg py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold gradient-text">
              GlowUp
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-12 animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Process <span className="gradient-text">Refund</span>
              </h1>
              <p className="text-lg text-gray-600">
                Enter your session ID to process a refund
              </p>
            </div>

            {/* Refund Form */}
            <form onSubmit={handleRefund} className="space-y-6">
              {/* Session ID */}
              <div>
                <label
                  htmlFor="sessionId"
                  className="block text-lg font-semibold text-gray-900 mb-3"
                >
                  Session ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="sessionId"
                  type="text"
                  value={sessionId}
                  onChange={handleSessionIdChange}
                  placeholder="cs_test_..."
                  required
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm font-mono text-sm"
                />
              </div>

              {/* Amount (Optional - for partial refund) */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-lg font-semibold text-gray-900 mb-3"
                >
                  Refund Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Leave empty for full refund"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm text-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Leave empty to refund the full amount
                </p>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-lg font-semibold text-gray-900 mb-3"
                >
                  Refund Reason (Optional)
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm text-lg"
                >
                  <option value="">Select a reason (optional)</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="fraudulent">Fraudulent</option>
                  <option value="requested_by_customer">
                    Requested by Customer
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !sessionId}
                className="w-full px-8 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Process Refund
                    </>
                  )}
                </span>
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Result Message */}
            {result && (
              <div
                className={`mt-8 p-6 rounded-2xl border-2 ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } animate-slide-up`}
              >
                {result.success ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-bold text-green-900">
                        Refund Successful!
                      </h3>
                    </div>
                    {result.refund && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Refund ID:</span>
                          <span className="font-mono text-gray-900">
                            {result.refund.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-green-700">
                            {formatAmount(
                              result.refund.amount,
                              result.refund.currency
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold text-green-700 capitalize">
                            {result.refund.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="text-gray-900">
                            {formatDate(result.refund.created)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">
                        Refund Failed
                      </h3>
                      <p className="text-red-700 mt-1">
                        {result.error?.message || "An error occurred"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Refund History */}
            {sessionId && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Refund History
                  </h2>
                  <button
                    onClick={loadRefundHistory}
                    disabled={loadingHistory}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingHistory ? "Loading..." : "Refresh"}
                  </button>
                </div>
                {loadingHistory ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
                  </div>
                ) : refundHistory.length > 0 ? (
                  <div className="space-y-4">
                    {refundHistory.map((refund) => (
                      <div
                        key={refund.id}
                        className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Refund ID:</span>
                            <p className="font-mono text-gray-900 mt-1">
                              {refund.id}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <p className="font-bold text-primary-600 mt-1">
                              {formatAmount(refund.amount, refund.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <p className="font-semibold capitalize mt-1">
                              {refund.status}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="text-gray-900 mt-1">
                              {formatDate(refund.created)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No refunds found for this session
                  </div>
                )}
              </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-6 bg-primary-50/80 backdrop-blur-sm rounded-2xl border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Information
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Enter the Session ID from your payment confirmation</li>
                <li>
                  • Leave amount empty for a full refund, or specify a partial
                  amount
                </li>
                <li>
                  • Refunds are processed immediately and may take 5-10 business
                  days to appear
                </li>
                <li>• You can check refund history for any session ID</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function RefundPage() {
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
      <RefundContent />
    </Suspense>
  );
}

