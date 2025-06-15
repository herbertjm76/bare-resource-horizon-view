
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

// Main landing page design for /bento
const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Navbar />

    {/* Bento-style Hero Section */}
    <section className="pt-24 md:pt-32 pb-14 md:pb-24 relative">
      <div className="max-w-7xl mx-auto px-2 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        {/* Hero - Spans first 2 columns on desktop */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <Hero />
        </div>
        {/* Two supporting tiles to the right of Hero */}
        <div className="md:col-span-2 grid grid-rows-2 gap-4 h-full">
          {/* Visual value prop 1 */}
          <BentoGridItem className="h-full flex flex-col justify-between bg-gradient-to-br from-purple-100 to-purple-50 animate-fade-in shadow-lg border border-purple-100">
            <div className="mb-2">
              <span className="inline-block text-xs font-medium bg-purple-200 text-purple-700 rounded px-2 py-1 mb-4">Instant Visibility</span>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">Tomorrow’s Capacity At a Glance</h3>
              <p className="text-gray-500 text-sm mb-1">No more guessing — see gaps & problems before they happen.</p>
            </div>
            <img
              src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
              alt="Capacity At a Glance screenshot"
              className="w-full h-20 object-cover rounded-lg"
              loading="lazy"
            />
          </BentoGridItem>
          {/* Visual value prop 2 */}
          <BentoGridItem className="h-full flex flex-col justify-between bg-gradient-to-tr from-green-100 to-white animate-fade-in shadow-lg border border-green-100">
            <div className="mb-2">
              <span className="inline-block text-xs font-medium bg-green-200 text-green-700 rounded px-2 py-1 mb-4">Fast Onboarding</span>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">Import Your Excel in 10 Minutes</h3>
              <p className="text-gray-500 text-sm mb-1">Start from spreadsheets or Google Sheets, upgrade instantly.</p>
            </div>
            <img
              src="/lovable-uploads/3865e409-9078-4560-94f4-6eb9e546d8c1.png"
              alt="Fast Excel Import"
              className="w-full h-20 object-cover rounded-lg"
              loading="lazy"
            />
          </BentoGridItem>
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

