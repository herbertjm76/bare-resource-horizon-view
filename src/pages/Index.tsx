import { Link } from 'react-router-dom';
import { Users, Calendar, ChartBar, Bell } from 'lucide-react';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/4ee866b4-50c7-498d-9317-98f506ede564.png"
                alt="BareResource Logo" 
                className="w-[20px] h-[20px] p-[1px] mr-2" 
              />
              <span className="text-2xl font-semibold">
                <span className="text-black">Bare</span>
                <span className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] bg-clip-text text-transparent">Resource</span>
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-gray-700">
              <Link to="#features" className="hover:text-purple-600 transition-colors">Features</Link>
              <Link to="#benefits" className="hover:text-purple-600 transition-colors">Benefits</Link>
              <Link to="#testimonials" className="hover:text-purple-600 transition-colors">Testimonials</Link>
              <Link to="#pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
            </div>
            
            {/* CTA Button */}
            <Link
              to="/auth"
              className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Project Management with Resource Intelligence
              </h1>
              <p className="text-xl text-white/80">
                Make smarter project decisions with powerful resource insights
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Get Started
                </button>
                <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative flex justify-center">
              <img 
                src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
                alt="Team collaboration illustration"
                className="w-[75%] h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Project Management, Elevated</h2>
            <p className="text-xl text-gray-600">Everything you need to run successful projects with intelligent resource planning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard
              icon={<Users className="w-8 h-8 text-purple-500" />}
              title="Smart Project Planning"
              description="Plan projects with confidence using AI-powered resource allocation insights."
            />
            <FeatureCard
              icon={<ChartBar className="w-8 h-8 text-purple-500" />}
              title="Resource Intelligence"
              description="Make data-driven staffing decisions with real-time capacity analysis."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-purple-500" />}
              title="Team Management"
              description="Optimize team workloads and prevent burnout with smart scheduling."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-purple-500" />}
              title="Project Tracking"
              description="Monitor project progress and resource utilization in real-time."
            />
            <FeatureCard
              icon={<ChartBar className="w-8 h-8 text-purple-500" />}
              title="Performance Analytics"
              description="Get detailed insights into project performance and team productivity."
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-purple-500" />}
              title="Proactive Alerts"
              description="Stay ahead with early warnings for project risks and resource conflicts."
            />
          </div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to transform your resource management?
              </h2>
              <p className="text-white/80 text-lg">
                Sign up for a free 14-day trial. No credit card required.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <select
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201+">201+ employees</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Start Free Trial
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">BareResource</h3>
              <p className="text-gray-400">
                Intuitive resource management for modern companies
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2023 BareResource. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
