const Hero = () => {
  return (
    <div className="relative pt-20 bg-hero">
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
  );
};

export default Hero;
