
import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 72; // px - updated height of AppHeader

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500">
      {/* App Header */}
      <AppHeader />
      
      {/* Hero Section - Minimalist Modern Design */}
      <div className="relative overflow-hidden" style={{ paddingTop: `${HEADER_HEIGHT + 16}px` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Simplify Resource Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mt-2">For Your Growing Business</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Track projects, manage workloads, and optimize timelines - all in one intuitive platform designed for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg text-lg hover:bg-white/20 transition-all duration-300 transform">
                Start Free Trial
              </button>
              <button className="bg-white/5 backdrop-blur-md text-white px-8 py-3 rounded-lg text-lg border border-white/20 hover:bg-white/10 transition-all duration-300 transform">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Clean, Minimalist */}
      <div id="features" className="backdrop-blur-xl bg-white/5 py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-tight">Everything you need to manage resources effectively</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards with cleaner design */}
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Project Tracking</h3>
              <p className="text-white/80 leading-relaxed">Keep all your projects organized and on track with our intuitive project management tools.</p>
            </div>
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Resource Planning</h3>
              <p className="text-white/80 leading-relaxed">Optimize your team's workload and ensure resources are allocated efficiently.</p>
            </div>
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Timeline Management</h3>
              <p className="text-white/80 leading-relaxed">Visual timeline tools to help you plan, track, and adjust project schedules easily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Simplified */}
      <div id="how-it-works" className="backdrop-blur-xl bg-white/5 py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="mt-4 text-xl text-white/80 font-light">Simple steps to optimize your resource management</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step, index) => (
              <div 
                key={step}
                className="glass-card p-8 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl text-white font-light">{step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step === 1 && "Sign Up"}
                  {step === 2 && "Add Resources"}
                  {step === 3 && "Create Projects"}
                  {step === 4 && "Track & Optimize"}
                </h3>
                <p className="text-white/80 leading-relaxed">
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

      {/* Pricing Section - Clean & Minimal */}
      <div id="pricing" className="backdrop-blur-xl bg-white/10 py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-white/80 font-light">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pricing cards with cleaner design */}
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold mb-4 text-white">Starter</h3>
              <div className="text-4xl font-bold mb-6 text-white">$29<span className="text-xl text-white/60">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 10 team members
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  5 active projects
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
              </ul>
              <button className="w-full bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all">
                Get Started
              </button>
            </div>
            <div className="glass-card p-8 rounded-xl border-2 border-white/20 animate-fade-in relative" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Professional</h3>
              <div className="text-4xl font-bold mb-6 text-white">$79<span className="text-xl text-white/60">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 50 team members
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/40 transition-all">
                Get Started
              </button>
            </div>
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-xl font-semibold mb-4 text-white">Enterprise</h3>
              <div className="text-4xl font-bold mb-6 text-white">$199<span className="text-xl text-white/60">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited team members
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom analytics
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 support
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <button className="w-full bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Simplified */}
      <div className="backdrop-blur-xl bg-white/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to optimize your resource management?</h2>
          <p className="text-xl text-white/80 mb-8 font-light">Join thousands of companies already using BareResource</p>
          <button className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-lg text-lg hover:bg-white/30 transition-all">
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer - Minimalist */}
      <footer className="backdrop-blur-xl bg-black/30 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BareResource</h3>
              <p className="text-gray-400 leading-relaxed">Simplifying resource management for growing businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/90">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integration</li>
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/90">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/90">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BareResource. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
