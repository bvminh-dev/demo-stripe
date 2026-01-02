'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: Record<string, string>;
  defaultPrice: {
    id: string;
    unit_amount: number | null;
    currency: string;
    recurring: any;
    type: string;
  } | null;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleGetStarted = async (priceId?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: number | null, currency: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getPriceInterval = (recurring: any) => {
    if (!recurring) return '';
    const interval = recurring.interval;
    const count = recurring.interval_count || 1;
    if (count === 1) {
      return `/${interval}`;
    }
    return `/${count} ${interval}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">GlowUp</div>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-primary-600 transition">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition">Pricing</Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-primary-600 transition">Testimonials</Link>
          </div>
          <button
            onClick={() => handleGetStarted()}
            disabled={isLoading}
            className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Transform Your Skin with
            <span className="text-primary-600 block mt-2">AI-Powered Skincare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Get personalized skincare recommendations powered by advanced AI. 
            Discover the perfect routine for your unique skin type and concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleGetStarted()}
              disabled={isLoading}
              className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Start Your Journey'}
            </button>
            <Link
              href="#features"
              className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-primary-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GlowUp?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of personalized skincare
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms analyze your skin type, concerns, and goals to create a personalized routine.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
            <p className="text-gray-600">
              Monitor your skin's progress with daily photo analysis and track improvements over time.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Recommendations</h3>
            <p className="text-gray-600">
              Get product recommendations from dermatologists and skincare experts tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you
          </p>
        </div>
        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pricing plans...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No pricing plans available. Please create products in your Stripe dashboard.</p>
          </div>
        ) : (
          <div className={`max-w-6xl mx-auto grid gap-8 ${products.length === 1 ? 'md:grid-cols-1 max-w-md' : products.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {products.map((product, index) => {
              const isPopular = false;  // product.metadata?.popular === 'true' || index === 1;
              const defaultPrice = product.defaultPrice;
              const priceAmount = defaultPrice?.unit_amount;
              const priceCurrency = defaultPrice?.currency || 'usd';
              const isRecurring = defaultPrice?.recurring;
              
              return (
                <div
                  key={product.id}
                  className={`bg-white p-8 rounded-2xl shadow-lg ${
                    isPopular
                      ? 'bg-primary-600 text-white shadow-xl transform scale-105'
                      : ''
                  }`}
                >
                  
                  {!isPopular && (
                    <h3 className={`text-2xl font-bold mb-4 ${isPopular ? '' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>
                  )}
                  <div className="mb-6">
                    {priceAmount ? (
                      <>
                        <span className={`text-5xl font-bold ${isPopular ? '' : 'text-gray-900'}`}>
                          {formatPrice(priceAmount, priceCurrency)}
                        </span>
                        <span className={isPopular ? 'text-primary-200' : 'text-gray-600'}>
                          {getPriceInterval(isRecurring)}
                        </span>
                      </>
                    ) : (
                      <span className={`text-2xl ${isPopular ? '' : 'text-gray-600'}`}>
                        Contact us for pricing
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className={`mb-6 ${isPopular ? 'text-primary-100' : 'text-gray-600'}`}>
                      {product.description}
                    </p>
                  )}
                  {/* Features from metadata */}
                  {product.metadata?.features && (
                    <ul className="space-y-4 mb-8">
                      {product.metadata.features.split(',').map((feature: string, idx: number) => (
                        <li key={idx} className={`flex items-center ${isPopular ? '' : 'text-gray-600'}`}>
                          <svg
                            className={`w-5 h-5 mr-3 ${isPopular ? '' : 'text-primary-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleGetStarted(defaultPrice?.id)}
                    disabled={isLoading || !defaultPrice}
                    className={`w-full px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 ${
                      isPopular
                        ? 'bg-white text-primary-600 hover:bg-gray-100'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {isLoading ? 'Loading...' : defaultPrice ? 'Get Started' : 'Contact Us'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "GlowUp transformed my skincare routine completely. The AI recommendations are spot-on and my skin has never looked better!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-200 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Verified User</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "I love how easy it is to track my progress. The weekly updates keep me motivated and the results speak for themselves."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-200 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold text-gray-900">Emily Chen</div>
                <div className="text-sm text-gray-600">Verified User</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "The personalized recommendations are incredible. It's like having a dermatologist in my pocket!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-200 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                <div className="text-sm text-gray-600">Verified User</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">GlowUp</div>
              <p className="text-gray-400">
                AI-powered skincare solutions for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GlowUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

