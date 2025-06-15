
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
import { Cpu, Wifi, Lock, Battery } from 'lucide-react';

// Main landing page design for /bento
const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Navbar />

    {/* Bento-style Hero Section */}
    <section className="pt-24 md:pt-32 pb-14 md:pb-24 relative">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        {/* Authentic Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 min-h-[80vh]">
          
          {/* Unified Studio Calendar - Large tile */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 flex flex-col justify-between border border-blue-200/50 shadow-lg animate-fade-in">
            <div>
              <h3 className="text-sm font-medium text-blue-600 mb-2">Unified Studio Calendar</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">One dashboard for all bookings</p>
            </div>
            <img 
              src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
              alt="Studio Calendar" 
              className="w-full h-32 object-cover rounded-xl shadow-md"
              loading="lazy"
            />
          </div>

          {/* 3x Faster - Number emphasis */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-violet-50 to-violet-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-violet-200/50 shadow-lg animate-fade-in">
            <p className="text-xs text-violet-600 mb-2">Up to</p>
            <h2 className="text-6xl font-extrabold text-violet-700 mb-2">3x</h2>
            <p className="text-sm font-medium text-violet-600">faster schedule updates</p>
          </div>

          {/* Resource Planning Brand - Main hero */}
          <div className="col-span-2 md:col-span-3 lg:col-span-5 row-span-3 bg-white rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-purple-200/50 shadow-xl animate-fade-in">
            <img
              src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
              alt="Resource Planning Dashboard"
              className="w-full max-w-md h-40 object-cover rounded-2xl shadow-lg mb-6"
              loading="eager"
            />
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-purple-700 mb-4">
              Resource Planning <span className="text-brand-primary">for Studios</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-md">
              Spot bottlenecks, balance workloads, and plan projects with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('signup');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white py-3 px-8 rounded-xl text-lg font-bold shadow hover:opacity-90 transition"
              >
                Start Free Trial
              </button>
              <button className="bg-white border border-purple-300 text-purple-700 font-semibold py-3 px-8 rounded-xl hover:bg-purple-50 transition flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" fill="currentColor" /></svg>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Instant Alerts */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-pink-200/50 shadow-lg animate-fade-in">
            <h3 className="text-4xl font-extrabold text-pink-600 mb-2">Instant</h3>
            <p className="text-sm font-medium text-pink-600">availability insights</p>
            <div className="mt-4 w-8 h-8 bg-pink-500 rounded-full animate-pulse"></div>
          </div>

          {/* Tomorrow's Capacity */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-green-200/50 shadow-lg animate-fade-in">
            <h3 className="text-5xl font-extrabold text-green-600 mb-2">110%</h3>
            <p className="text-xs font-medium text-green-600 mb-1">Tomorrow's Capacity</p>
            <p className="text-xs text-green-500">See risk before it hits</p>
          </div>

          {/* Excel Import with icon */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-6 flex flex-col justify-between border border-yellow-200/50 shadow-lg animate-fade-in">
            <div>
              <h3 className="text-sm font-medium text-yellow-600 mb-2">Import from Excel</h3>
              <h2 className="text-3xl font-bold text-yellow-700 mb-1">10 min</h2>
              <p className="text-xs text-yellow-600">to get started</p>
            </div>
            <img 
              src="/lovable-uploads/3865e409-9078-4560-94f4-6eb9e546d8c1.png" 
              alt="Excel" 
              className="w-12 h-12 rounded-lg self-end"
              loading="lazy"
            />
          </div>

          {/* Budget Tracking */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 flex flex-col justify-center border border-orange-200/50 shadow-lg animate-fade-in">
            <h3 className="text-lg font-bold text-orange-600 mb-2">Budget Won't Escape</h3>
            <p className="text-sm text-orange-500">Live fee tracking & alerts</p>
            <div className="mt-4 flex space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            </div>
          </div>

          {/* Secure Platform */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-red-200/50 shadow-lg animate-fade-in">
            <Lock className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="text-sm font-bold text-red-600 mb-1">Secure</h3>
            <p className="text-xs text-red-500">Enterprise-grade</p>
          </div>

          {/* 20+ Integrations */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-sky-200/50 shadow-lg animate-fade-in">
            <h2 className="text-4xl font-extrabold text-sky-600 mb-2">20+</h2>
            <p className="text-sm font-medium text-sky-600 mb-1">Integrations</p>
            <p className="text-xs text-sky-500">Works with your tools</p>
            <Wifi className="w-6 h-6 text-sky-400 mt-2" />
          </div>

          {/* Cloud Performance */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-6 flex flex-col justify-center border border-indigo-200/50 shadow-lg animate-fade-in">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">Industry-leading performance</h3>
            <p className="text-sm text-indigo-500 mb-3">Powered by cloud architecture</p>
            <Cpu className="w-8 h-8 text-indigo-400" />
          </div>

          {/* 24/7 Support */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-emerald-200/50 shadow-lg animate-fade-in">
            <div className="bg-emerald-400 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">24/7</div>
            <h3 className="text-sm font-bold text-emerald-600 mb-1">Support</h3>
            <p className="text-xs text-emerald-500">Always here to help</p>
            <Battery className="w-6 h-6 text-emerald-400 mt-2" />
          </div>

        </div>
      </div>
    </section>

    {/* Sticky CTA for mobile */}
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-200">
      <div className="bg-white/95 border-t border-gray-200 px-4 py-3 flex justify-center items-center shadow-2xl">
        <button
          onClick={() => {
            const el = document.getElementById('signup');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="w-full bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white py-3 rounded-xl text-lg font-bold shadow ring-2 ring-purple-200 hover:opacity-90 transition"
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
