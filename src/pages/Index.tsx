
import { Link } from 'react-router-dom';

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white animate-fade-in">BareResource</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-white/90 hover:text-white transition-colors duration-200 hover:scale-105 transform">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-white/90 hover:text-white transition-colors duration-200 hover:scale-105 transform">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-white/90 hover:text-white transition-colors duration-200 hover:scale-105 transform">Pricing</button>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 transform"
              >
                Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">
              Simplify Resource Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">For Your Growing Business</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Track projects, manage workloads, and optimize timelines - all in one intuitive platform designed for modern teams.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 transform">
                Start Free Trial
              </button>
              <button className="bg-white/5 backdrop-blur-sm text-white px-8 py-3 rounded-lg text-lg border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 transform">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="backdrop-blur-md bg-white/5 py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Everything you need to manage resources effectively</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards with animation */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
              <p className="text-gray-600">Keep all your projects organized and on track with our intuitive project management tools.</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Planning</h3>
              <p className="text-gray-600">Optimize your team's workload and ensure resources are allocated efficiently.</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Timeline Management</h3>
              <p className="text-gray-600">Visual timeline tools to help you plan, track, and adjust project schedules easily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="backdrop-blur-md bg-white/10 py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-xl text-white/80">Simple steps to optimize your resource management</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step, index) => (
              <div 
                key={step}
                className="backdrop-blur-md bg-white/5 p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-indigo-600">{step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {step === 1 && "Sign Up"}
                  {step === 2 && "Add Resources"}
                  {step === 3 && "Create Projects"}
                  {step === 4 && "Track & Optimize"}
                </h3>
                <p className="text-gray-600">
                  {step === 1 && "Create your account and set up your organization profile"}
                  {step === 2 && "Input your team members and available resources"}
                  {step === 3 && "Set up your projects and define their requirements"}
                  {step === 4 && "Monitor progress and optimize resource allocation"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="backdrop-blur-md bg-white/5 py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-white/80">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pricing cards with animation */}
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-xl text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 10 team members
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  5 active projects
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
              </ul>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl border-2 border-purple-300/30 hover:scale-105 transition-all duration-300 animate-fade-in relative" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional</h3>
              <div className="text-4xl font-bold mb-4">$79<span className="text-xl text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 50 team members
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">$199<span className="text-xl text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited team members
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="backdrop-blur-md bg-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to optimize your resource management?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of companies already using BareResource</p>
          <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 transform">
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-black/20 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BareResource</h3>
              <p className="text-gray-400">Simplifying resource management for growing businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integration</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BareResource. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
