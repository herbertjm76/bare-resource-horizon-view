
import { Link } from 'react-router-dom';
import { Users, Calendar, ChartBar, Bell } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#251F4E] via-[#6E59A5] to-[#D553CA]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-semibold">
              <span className="text-black">Bare</span>
              <span className="bg-gradient-to-r from-[#251F4E] via-[#6E59A5] to-[#D553CA] bg-clip-text text-transparent">Resource</span>
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
              className="bg-gradient-to-r from-[#251F4E] via-[#6E59A5] to-[#D553CA] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
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
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-48 w-full"></div>
              </div>
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
