
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { BentoGrid, BentoGridItem } from '../components/landing/BentoGrid';
import Hero from '../components/landing/Hero';
import FeatureTrio from '../components/landing/FeatureTrio';
import ExcelComparison from '../components/landing/ExcelComparison';
import Benefits from '../components/landing/Benefits';
import Pricing from '../components/landing/Pricing';
import LeadMagnet from '../components/landing/LeadMagnet';
import FAQ from '../components/landing/FAQ';
import SignUpSection from '../components/landing/SignUpSection';
import FooterCTA from '../components/landing/FooterCTA';
import SocialProof from '../components/landing/SocialProof';
import { TrendingUp, Zap, Shield, Clock, Users, Target } from 'lucide-react';

// Main landing page design for /bento
const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    {/* Enhanced Bento-style Hero Section - No Gaps */}
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Sophisticated Bento Grid Layout - No Gaps */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-0 min-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Main Hero Message - Central focus */}
          <div className="col-span-2 md:col-span-4 lg:col-span-6 row-span-3 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                Used by 1000+ studios worldwide
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Stop Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Chaos</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg mx-auto leading-relaxed">
                See every project, person, and deadline in one intelligent dashboard. Never overbook or miss a deadline again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const el = document.getElementById('signup');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  Start Free Trial
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" fill="currentColor" /></svg>
                  Watch Demo (2 min)
                </button>
              </div>
            </div>
          </div>

          {/* Instant Problem Solving */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-emerald-500 to-teal-600 p-4 md:p-6 flex flex-col justify-center items-center text-center text-white">
            <Target className="w-8 h-8 md:w-12 md:h-12 mb-3 opacity-90" />
            <h3 className="text-lg md:text-2xl font-bold mb-2">Spot Bottlenecks</h3>
            <p className="text-sm md:text-base opacity-90">Before they kill your projects</p>
          </div>

          {/* Current Capacity Data */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 md:p-6 flex flex-col justify-center items-center text-center text-white">
            <div className="text-2xl md:text-4xl font-bold mb-1">40h</div>
            <h3 className="text-lg font-semibold mb-1">Weekly Capacity</h3>
            <p className="text-sm opacity-90">Current utilization</p>
          </div>

          {/* Speed & Efficiency */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 p-4 md:p-6 flex items-center gap-4 text-white">
            <Clock className="w-10 h-10 md:w-16 md:h-16 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">5 hours saved</h3>
              <p className="text-sm md:text-base text-slate-300">per week on resource planning</p>
            </div>
          </div>

          {/* Visual Dashboard Preview with Real Data */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2 bg-white p-4 md:p-6 flex flex-col justify-between border-r border-slate-200">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3">Live Resource Dashboard</h3>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white mb-4">
                <h4 className="text-sm font-medium mb-2">Weekly Resource Utilization</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Team A</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-red-400 rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">200%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Team B</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">70%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Team C</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-slate-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-semibold">+12</div>
              </div>
              <span className="text-sm text-slate-600">Real-time collaboration</span>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 flex flex-col justify-center items-center text-center">
            <Shield className="w-8 h-8 md:w-12 md:h-12 text-slate-700 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Enterprise</h3>
            <p className="text-sm text-slate-600">Security & SOC2</p>
          </div>

          {/* Quick Setup */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-yellow-400 to-orange-500 p-4 md:p-6 flex flex-col justify-center items-center text-center text-white">
            <div className="text-2xl md:text-4xl font-bold mb-2">10 min</div>
            <h3 className="text-sm md:text-base font-semibold mb-1">Setup Time</h3>
            <p className="text-xs md:text-sm opacity-90">Import from Excel/CSV</p>
          </div>

          {/* Project Status Visualization */}
          <div className="col-span-2 md:col-span-3 bg-white p-4 md:p-6 flex items-center gap-4 border-r border-slate-200">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-75"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Project Status</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">In Progress (75%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600">Complete (25%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-purple-600 to-indigo-600 p-4 md:p-6 flex items-center gap-4 text-white">
            <Users className="w-10 h-10 md:w-16 md:h-16 flex-shrink-0" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">Unlimited Team</h3>
              <p className="text-sm md:text-base opacity-90">No per-seat pricing ever</p>
            </div>
          </div>

          {/* Integration Power */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-500 to-blue-600 p-4 md:p-6 flex flex-col justify-center items-center text-center text-white">
            <div className="text-2xl md:text-3xl font-bold mb-2">50+</div>
            <h3 className="text-sm md:text-base font-semibold mb-1">Integrations</h3>
            <p className="text-xs md:text-sm opacity-90">Works with your tools</p>
          </div>

          {/* Success Metric */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-green-500 to-emerald-600 p-4 md:p-6 flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">98% Uptime</h3>
              <p className="text-sm md:text-base opacity-90">Enterprise reliability</p>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Sticky CTA for mobile */}
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-200">
      <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 flex justify-center items-center shadow-2xl">
        <button
          onClick={() => {
            const el = document.getElementById('signup');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Start Free Trial
        </button>
      </div>
    </div>

    {/* Social Proof - logos + testimonial */}
    <SocialProof />

    {/* Feature/Benefit Trio with simple fade-in (for trust/context) */}
    <section id="features">
      <FeatureTrio />
    </section>

    {/* Problem vs. Outcome */}
    <section>
      <ExcelComparison />
      <Benefits />
    </section>

    {/* Pricing & Lead Magnet */}
    <div className="relative z-10">
      <Pricing />
      <LeadMagnet />
    </div>

    {/* Sign up, CTA and FAQ */}
    <div className="relative z-20">
      <SignUpSection />
      <FooterCTA />
      <FAQ />
      <Footer />
    </div>
  </div>
);

export default IndexBento;
