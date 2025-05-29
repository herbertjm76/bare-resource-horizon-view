
const Hero = () => {
  return (
    <div className="relative pt-20 bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium">
                ✨ Smart Resource Intelligence Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Turn Resource Chaos Into 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Strategic Success
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Stop guessing. Start planning. Our AI-powered platform transforms how you allocate resources, 
                predict capacity, and deliver projects on time and under budget.
              </p>
            </div>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">40% Faster Project Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium">Real-time Capacity Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-medium">Intelligent Workload Balancing</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Free Trial
              </button>
              <button className="bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300 font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </button>
            </div>
            
            <div className="text-white/70 text-sm">
              ⚡ Setup in 5 minutes • 🔒 Enterprise-grade security • 📊 Works with your existing tools
            </div>
          </div>
          
          {/* Hero Image - Dashboard Preview */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Floating cards around main image */}
              <div className="absolute -top-8 -left-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-10 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Productivity</div>
                    <div className="text-lg font-bold text-green-600">+47%</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-10 animate-float animation-delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Time Saved</div>
                    <div className="text-lg font-bold text-blue-600">12 hrs/week</div>
                  </div>
                </div>
              </div>
              
              {/* Main dashboard image */}
              <div className="bg-white/15 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
                <img 
                  src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
                  alt="BareResource Dashboard - Resource Management Interface" 
                  className="w-full rounded-2xl shadow-lg max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
