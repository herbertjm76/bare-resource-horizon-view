
import { Link } from 'react-router-dom';
import { Users, Calendar, ChartBar, Bell } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/5 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-semibold">
              <span className="text-black">Bare</span>
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Resource</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-white">
              <Link to="#features" className="hover:text-purple-200 transition-colors">Features</Link>
              <Link to="#benefits" className="hover:text-purple-200 transition-colors">Benefits</Link>
              <Link to="#testimonials" className="hover:text-purple-200 transition-colors">Testimonials</Link>
              <Link to="#pricing" className="hover:text-purple-200 transition-colors">Pricing</Link>
            </div>
            
            {/* CTA Button */}
            <Link
              to="/auth"
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-lg"
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
                Simplify Resource Management For Your Company
              </h1>
              <p className="text-xl text-white/80">
                Track resources, projects, workloads, and timelines in one intuitive platform.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your company's resources effectively</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard
              icon={<Users className="w-8 h-8 text-purple-500" />}
              title="Resource Allocation"
              description="Easily assign team members to projects based on skills and availability."
            />
            <FeatureCard
              icon={<ChartBar className="w-8 h-8 text-purple-500" />}
              title="Project Management"
              description="Create, track and manage projects with deadlines and milestones."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-purple-500" />}
              title="Workload Balancing"
              description="Visualize team workloads to prevent burnout and optimize productivity."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-purple-500" />}
              title="Timeline Tracking"
              description="Interactive Gantt charts to visualize project progress and deadlines."
            />
            <FeatureCard
              icon={<ChartBar className="w-8 h-8 text-purple-500" />}
              title="Analytics Dashboard"
              description="Get insights into resource utilization and project performance."
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-purple-500" />}
              title="Automated Alerts"
              description="Receive notifications about resource conflicts and timeline issues."
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
