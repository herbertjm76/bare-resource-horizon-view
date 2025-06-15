
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
import { TrendingUp, Zap } from 'lucide-react';

// Mood stock photo from Unsplash (visual harmony, human element)
const MOOD_IMAGE = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80"; // vibrant, people/screens mood

// Your custom illustration (uploaded)
const HERO_ILLUSTRATION = "/lovable-uploads/be1d400c-e1fc-4707-9639-5ef830974c2c.png";

const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-brand-violet-light via-white to-pink-100/30">
    <Navbar />
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      {/* Branded grid color overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-white/90 to-pink-100/40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Bento-style seamless grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-0 min-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
          {/* Mood Stock Photo Tile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-end">
            <div className="relative w-full h-full min-h-[170px]">
              <img
                src={MOOD_IMAGE}
                alt="Team collaboration mood photo"
                className="object-cover w-full h-full rounded-b-3xl md:rounded-ss-3xl md:rounded-es-none"
                style={{ minHeight: 170, maxHeight: 330, filter: 'brightness(85%)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 via-brand-primary/20 to-transparent rounded-b-3xl md:rounded-ss-3xl transition-all"></div>
              <div className="absolute left-4 bottom-3 text-white text-base md:text-xl font-semibold drop-shadow-lg tracking-wide">
                Teams in Flow
              </div>
            </div>
          </div>
          {/* Central Illustration (Your Uploaded Image) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-center bg-white/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/10 to-brand-primary/5"></div>
            <img
              src={HERO_ILLUSTRATION}
              alt="Resource dashboard illustration"
              className="relative z-10 w-full h-auto max-h-72 md:max-h-80 object-contain mx-auto drop-shadow-xl"
              style={{ filter: "drop-shadow(0 8px 32px rgba(100,101,240,0.13))" }}
            />
          </div>
          {/* Hero Copy & CTA */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5 row-span-3 bg-gradient-to-br from-brand-primary via-brand-violet to-pink-400/70 p-7 md:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-brand-violet/15 to-white/0"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white/90 mb-6 shadow-md tracking-wide">
                <Zap className="w-4 h-4 text-yellow-300" />
                1,000+ studios elevated
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight font-sans tracking-tight drop-shadow">
                End Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-200">Chaos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto leading-relaxed font-medium">
                Balance capacity. <span className="text-pink-100/90">Spot bottlenecks</span>. <span className="text-blue-100/90">Deliver on time</span>.<br />
                Visualize people and projects in one space—finally, clarity for your whole team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const el = document.getElementById('signup');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-white text-brand-primary py-4 px-8 rounded-xl text-lg font-semibold shadow-xl hover:bg-brand-violet-light hover:text-brand-primary transition-all duration-200 border-2 border-white/90 hover:scale-105"
                >
                  Start Free Trial
                </button>
                <button className="bg-white/10 border border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" />
                  </svg>
                  Watch Demo (2 min)
                </button>
              </div>
            </div>
          </div>
          {/* Quick Metric Tile (Right bento) */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-100 via-brand-violet-light to-brand-violet/70 p-5 md:p-7 flex flex-col justify-center items-center text-center text-brand-primary border-l border-brand-primary/10">
            <TrendingUp className="w-8 h-8 md:w-12 md:h-12 mb-2 text-brand-primary" />
            <div className="text-2xl md:text-3xl font-bold mb-0">40h</div>
            <div className="text-md opacity-85">Weekly Capacity</div>
            <div className="text-xs md:text-sm mt-2 text-brand-gray">Per team member</div>
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
          className="w-full bg-gradient-to-r from-brand-primary to-brand-violet text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Start Free Trial
        </button>
      </div>
    </div>
    {/* Social Proof - logos + testimonial */}
    <SocialProof />
    {/* Feature/Benefit Trio */}
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
