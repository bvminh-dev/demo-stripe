"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserMetadata {
  userId: string;
  creditGranted: number;
  locale: string;
}

const STORAGE_KEY = "user_metadata";

export default function SetupPage() {
  const [metadata, setMetadata] = useState<UserMetadata>({
    userId: "",
    creditGranted: 0,
    locale: "en",
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load metadata from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMetadata(parsed);
      } catch (error) {
        console.error("Error loading metadata:", error);
      }
    }
  }, []);

  // Generate GUID function
  const generateGUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Generate random number from 1 to 10
  const generateCreditGranted = (): number => {
    return Math.floor(Math.random() * 10) + 1;
  };

  // Handle GUID generation
  const handleGenerateUserId = () => {
    const newGuid = generateGUID();
    setMetadata((prev) => ({ ...prev, userId: newGuid }));
    setIsSaved(false);
  };

  // Handle CreditGranted generation
  const handleGenerateCreditGranted = () => {
    const newCredit = generateCreditGranted();
    setMetadata((prev) => ({ ...prev, creditGranted: newCredit }));
    setIsSaved(false);
  };

  // Handle manual input changes
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata((prev) => ({ ...prev, userId: e.target.value }));
    setIsSaved(false);
  };

  const handleCreditGrantedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10) || 0;
    setMetadata((prev) => ({ ...prev, creditGranted: value }));
    setIsSaved(false);
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetadata((prev) => ({ ...prev, locale: e.target.value }));
    setIsSaved(false);
  };

  // Save to local storage
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
                Setup User <span className="gradient-text">Metadata</span>
              </h1>
              <p className="text-lg text-gray-600">
                Configure your user metadata for payment processing
              </p>
            </div>

            {/* UserId Field */}
            <div className="mb-8">
              <label
                htmlFor="userId"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                User ID
              </label>
              <div className="flex gap-3">
                <input
                  id="userId"
                  type="text"
                  value={metadata.userId}
                  onChange={handleUserIdChange}
                  placeholder="Click Generate to create a GUID"
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm font-mono text-sm"
                />
                <button
                  onClick={handleGenerateUserId}
                  className="px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                >
                  Generate GUID
                </button>
              </div>
              {metadata.userId && (
                <p className="mt-2 text-sm text-gray-500">
                  Generated GUID:{" "}
                  <span className="font-mono">{metadata.userId}</span>
                </p>
              )}
            </div>

            {/* CreditGranted Field */}
            <div className="mb-8">
              <label
                htmlFor="creditGranted"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Credit Granted
              </label>
              <div className="flex gap-3">
                <input
                  id="creditGranted"
                  type="number"
                  value={metadata.creditGranted || ""}
                  onChange={handleCreditGrantedChange}
                  placeholder="Enter a number or click Generate"
                  min="0"
                  max="100"
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm text-lg font-semibold"
                />
                <button
                  onClick={handleGenerateCreditGranted}
                  className="px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                >
                  Generate (1-10)
                </button>
              </div>
              {metadata.creditGranted > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Current value:{" "}
                  <span className="font-semibold">
                    {metadata.creditGranted}
                  </span>
                </p>
              )}
            </div>

            {/* Locale Field */}
            <div className="mb-8">
              <label
                htmlFor="locale"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Locale
              </label>
              <select
                id="locale"
                value={metadata.locale}
                onChange={handleLocaleChange}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm text-lg font-semibold"
              >
                <option value="auto">Auto (Browser Default)</option>
                <option value="bg">Bulgarian (Български)</option>
                <option value="cs">Czech (Čeština)</option>
                <option value="da">Danish (Dansk)</option>
                <option value="de">German (Deutsch)</option>
                <option value="el">Greek (Ελληνικά)</option>
                <option value="en">English</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="es">Spanish (Español)</option>
                <option value="es-419">Spanish (Latin America)</option>
                <option value="et">Estonian (Eesti)</option>
                <option value="fi">Finnish (Suomi)</option>
                <option value="fil">Filipino</option>
                <option value="fr">French (Français)</option>
                <option value="fr-CA">French (Canada)</option>
                <option value="hr">Croatian (Hrvatski)</option>
                <option value="hu">Hungarian (Magyar)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="lt">Lithuanian (Lietuvių)</option>
                <option value="lv">Latvian (Latviešu)</option>
                <option value="ms">Malay (Bahasa Melayu)</option>
                <option value="mt">Maltese (Malti)</option>
                <option value="nb">Norwegian Bokmål (Norsk Bokmål)</option>
                <option value="nl">Dutch (Nederlands)</option>
                <option value="pl">Polish (Polski)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="ro">Romanian (Română)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="sk">Slovak (Slovenčina)</option>
                <option value="sl">Slovenian (Slovenščina)</option>
                <option value="sv">Swedish (Svenska)</option>
                <option value="th">Thai (ไทย)</option>
                <option value="tr">Turkish (Türkçe)</option>
                <option value="vi">Vietnamese (Tiếng Việt)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="zh-HK">Chinese (Hong Kong)</option>
                <option value="zh-TW">Chinese (Traditional)</option>
              </select>
              {metadata.locale && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected locale:{" "}
                  <span className="font-semibold">{metadata.locale}</span>
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={handleSave}
                className="flex-1 px-8 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSaved ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Saved!
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save to Local Storage
                    </>
                  )}
                </span>
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <Link
                href="/"
                className="px-8 py-5 rounded-2xl font-bold text-lg text-primary-600 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-primary-600/30 hover:border-primary-600 hover:scale-105 text-center"
              >
                Go to Payment
              </Link>
            </div>

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
                <li>• Your metadata will be saved to browser local storage</li>
                <li>• This data will be used when processing payments</li>
                <li>• You can update these values anytime before checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
