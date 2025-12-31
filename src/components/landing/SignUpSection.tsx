
import { useState } from 'react';
import { Check, ArrowRight, Brain } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { logger } from '@/utils/logger';

const SignUpSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    logger.debug('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    "14-day free trial with full AI features",
    "No credit card required", 
    "Setup in 10 minutes",
    "Import from Excel instantly"
  ];

  return (
    <div className="bg-gradient-to-br from-[#1A1F2C] via-[#2D1B69] to-[#1A1F2C] py-16 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-[float_8s_ease-in-out_infinite] animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-[float_7s_ease-in-out_infinite] animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Copy */}
          <div className="text-center lg:text-left">
            <AnimatedSection animation="fadeInLeft" delay={200}>
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium mb-4 transition-all duration-300 hover:scale-105">
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                🎯 Get AI Business Intelligence
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeInLeft" delay={400}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Stop Guessing When to
                <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-[pulse_3s_ease-in-out_infinite]">
                  Hire & Prospect
                </span>
              </h2>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeInLeft" delay={600}>
              <p className="text-lg text-white/80 mb-6">
                Join the growing number of design teams who get AI-powered hiring and pipeline recommendations. 
                Never miss a growth opportunity or burn out your team again.
              </p>
            </AnimatedSection>
            
            {/* Benefits List */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={index} animation="fadeInLeft" delay={800 + (index * 100)}>
                  <div className="flex items-center gap-3 text-white/90 transition-all duration-300 hover:text-white hover:translate-x-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
            {/* AI Feature Highlight */}
            <AnimatedSection animation="scaleIn" delay={1200}>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 mb-6 border border-white/20 transition-all duration-500 hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-orange-500/30 hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="text-white font-semibold text-sm">AI Business Advisor Included</span>
                </div>
                <p className="text-white/80 text-sm">
                  "Your team is trending toward 95% utilization. Based on current pipeline, 
                  hire 1 senior designer within 45 days to prevent bottlenecks."
                </p>
              </div>
            </AnimatedSection>
            
            {/* Social Proof */}
            <AnimatedSection animation="fadeInLeft" delay={1400}>
              <div className="text-white/70 text-sm">
                <p className="mb-1">⭐⭐⭐⭐⭐ "The AI hiring alerts saved us from a disaster!" - Early user feedback</p>
                <p>"Spotted our pipeline gap 2 months early and landed 3 new clients" - Design Director, Portland</p>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Right Side - Form */}
          <AnimatedSection animation="fadeInRight" delay={600}>
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 hover:bg-white hover:shadow-3xl hover:scale-105">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get AI Business Intelligence Free</h3>
                  <p className="text-gray-600 text-sm">Your personal business advisor that never sleeps</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                  
                  <input
                    type="text"
                    name="company"
                    placeholder="Studio/Agency Name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                  
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100"
                    required
                  >
                    <option value="">How big is your team?</option>
                    <option value="2-5">2-5 people (freelancer + help)</option>
                    <option value="6-10">6-10 people (small studio)</option>
                    <option value="11-20">11-20 people (growing agency)</option>
                    <option value="21-50">21-50 people (established agency)</option>
                    <option value="50+">50+ people (we should talk!)</option>
                  </select>
                  
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                  >
                    Start Getting AI Business Insights
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
                
                <div className="text-center mt-4 text-xs text-gray-500">
                  By signing up, you agree to our{' '}
                  <a href="/privacy-policy" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300">
                    Privacy Policy
                  </a>
                </div>
              </div>
              
              {/* Floating trust indicators */}
              <div className="absolute -top-3 -left-3 bg-white rounded-xl p-2 shadow-lg animate-[float_3s_ease-in-out_infinite]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">AI Included</span>
                </div>
              </div>
              
              <div className="absolute -bottom-3 -right-3 bg-white rounded-xl p-2 shadow-lg animate-[float_3s_ease-in-out_infinite] animation-delay-1000">
                <div className="text-xs">
                  <div className="font-semibold text-gray-700">💡 Smart Insights</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
