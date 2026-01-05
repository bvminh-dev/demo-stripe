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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = async (priceId?: string) => {
    setIsLoading(true);
    try {
      // Get metadata from local storage
      const storedMetadata = localStorage.getItem('user_metadata');
      let metadata = null;
      if (storedMetadata) {
        try {
          metadata = JSON.parse(storedMetadata);
        } catch (error) {
          console.error('Error parsing metadata:', error);
        }
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, metadata }),
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
    <div className="min-h-screen bg-gradient-to-br from-skincare-cream via-white to-skincare-pink relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-skincare-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass backdrop-blur-md shadow-lg py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold gradient-text">GlowUp</div>
            <div className="hidden md:flex space-x-8">
              <Link 
                href="#features" 
                className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="#pricing" 
                className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group"
              >
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="#testimonials" 
                className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group"
              >
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/setup" 
                className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group"
              >
                Setup
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/refund" 
                className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group"
              >
                Refund
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <button
              onClick={() => handleGetStarted()}
              disabled={isLoading}
              className="relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group glow-on-hover transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
              }}
            >
              <span className="relative z-10">{isLoading ? 'Loading...' : 'Get Started'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 mb-6 leading-tight">
              Transform Your Skin with
              <span className="block mt-4 gradient-text">AI-Powered Skincare</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get personalized skincare recommendations powered by advanced AI. 
              Discover the perfect routine for your unique skin type and concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => handleGetStarted()}
                disabled={isLoading}
                className="group relative px-10 py-5 rounded-2xl text-lg font-bold text-white overflow-hidden hover-lift glow-on-hover transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #f87171 50%, #ff9ec0 100%)',
                  backgroundSize: '200% 200%',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Your Journey
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 shimmer-effect"></div>
              </button>
              <Link
                href="#features"
                className="group px-10 py-5 rounded-2xl text-lg font-bold text-primary-600 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-primary-600/30 hover:border-primary-600 hover-lift"
              >
                Learn More
                <svg className="inline-block ml-2 w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Why Choose <span className="gradient-text">GlowUp?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of personalized skincare
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms analyze your skin type, concerns, and goals to create a personalized routine.',
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Real-Time Tracking',
                description: 'Monitor your skin\'s progress with daily photo analysis and track improvements over time.',
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Expert Recommendations',
                description: 'Get product recommendations from dermatologists and skincare experts tailored to your needs.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-white/50 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          {loadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-6"></div>
              <p className="text-xl text-gray-600">Loading pricing plans...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No pricing plans available. Please create products in your Stripe dashboard.</p>
            </div>
          ) : (
            <div className={`max-w-7xl mx-auto grid gap-8 ${products.length === 1 ? 'md:grid-cols-1 max-w-md' : products.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {products.map((product, index) => {
                const isPopular = false;
                const defaultPrice = product.defaultPrice;
                const priceAmount = defaultPrice?.unit_amount;
                const priceCurrency = defaultPrice?.currency || 'usd';
                const isRecurring = defaultPrice?.recurring;
                
                return (
                  <div
                    key={product.id}
                    className={`group relative p-10 rounded-3xl shadow-2xl transition-all duration-500 hover-lift animate-scale-in ${
                      isPopular
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white transform scale-105'
                        : 'bg-white/90 backdrop-blur-sm'
                    }`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    )}
                    <div className="relative z-10">
                      <h3 className={`text-3xl font-bold mb-6 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                      <div className="mb-8">
                        {priceAmount ? (
                          <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-extrabold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                              {formatPrice(priceAmount, priceCurrency).split('.')[0]}
                            </span>
                            <span className={`text-2xl ${isPopular ? 'text-primary-100' : 'text-gray-600'}`}>
                              {formatPrice(priceAmount, priceCurrency).split('.')[1]}
                            </span>
                            <span className={`text-xl ${isPopular ? 'text-primary-200' : 'text-gray-500'}`}>
                              {getPriceInterval(isRecurring)}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-2xl ${isPopular ? 'text-primary-100' : 'text-gray-600'}`}>
                            Contact us for pricing
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className={`mb-8 text-lg ${isPopular ? 'text-primary-50' : 'text-gray-600'}`}>
                          {product.description}
                        </p>
                      )}
                      {product.metadata?.features && (
                        <ul className="space-y-4 mb-10">
                          {product.metadata.features.split(',').map((feature: string, idx: number) => (
                            <li key={idx} className={`flex items-start ${isPopular ? 'text-white' : 'text-gray-700'}`}>
                              <svg
                                className={`w-6 h-6 mr-3 mt-0.5 flex-shrink-0 ${isPopular ? 'text-primary-200' : 'text-primary-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-lg">{feature.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() => handleGetStarted(defaultPrice?.id)}
                        disabled={isLoading || !defaultPrice}
                        className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 hover:scale-105 ${
                          isPopular
                            ? 'bg-white text-primary-600 hover:bg-gray-100 shadow-lg'
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-xl'
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </span>
                        ) : defaultPrice ? (
                          'Get Started'
                        ) : (
                          'Contact Us'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Verified User',
                content: '"GlowUp transformed my skincare routine completely. The AI recommendations are spot-on and my skin has never looked better!"',
              },
              {
                name: 'Emily Chen',
                role: 'Verified User',
                content: '"I love how easy it is to track my progress. The weekly updates keep me motivated and the results speak for themselves."',
              },
              {
                name: 'Michael Rodriguez',
                role: 'Verified User',
                content: '"The personalized recommendations are incredible. It\'s like having a dermatologist in my pocket!"',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full mr-4 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-bold gradient-text mb-6">GlowUp</div>
              <p className="text-gray-400 text-lg leading-relaxed">
                AI-powered skincare solutions for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-4"></span>
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2024 GlowUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
