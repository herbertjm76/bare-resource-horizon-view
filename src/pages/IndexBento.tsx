
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

const bentos = [
  {
    label: "Unified Studio Calendar",
    icon: "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png",
    description: "One page for all bookings",
    className: "col-span-2 row-span-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100",
  },
  {
    label: "3x Faster Updates",
    value: "Up to",
    metric: "3x",
    description: "quicker schedule changes",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-100 text-[#7B62FC]",
  },
  {
    label: "Automatic Alerts",
    icon: null,
    metric: "Instant",
    description: "Availability insights",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-100 text-[#E64FC4]",
  },
  {
    label: "Tomorrow’s Capacity",
    metric: "110%",
    description: "See risk before it hits",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-green-50 to-green-100 border-green-100 text-[#30C286]",
  },
  {
    // Center main bento
    label: "",
    icon: "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png",
    description: "",
    isCenter: true,
    className: "col-span-2 row-span-2 flex flex-col items-center justify-center bg-white border-purple-100",
  },
  {
    label: "Import from Excel",
    icon: "/lovable-uploads/3865e409-9078-4560-94f4-6eb9e546d8c1.png",
    metric: "10m",
    description: "Start in 10 minutes",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-100 text-yellow-600",
  },
  {
    label: "Budget Won’t Escape",
    metric: "",
    icon: null,
    description: "Live fee tracking",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-100 text-orange-500",
  },
  {
    label: "20+ Integrations",
    icon: null,
    metric: "20+",
    description: "Works with your tools",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-100 text-sky-500",
  },
  {
    label: "Industry-Leading Support",
    icon: null,
    metric: "24/5",
    description: "Onboarding & support included",
    className: "col-span-1 row-span-1 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-100 text-gray-700",
  },
];

// Main landing page design for /bento
const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Navbar />

    {/* Bento-style Hero Section */}
    <section className="pt-24 md:pt-32 pb-14 md:pb-24 relative">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        {/* 3x3/modern bento grid: mobile 1-col, md 3-cols */}
        <BentoGrid>
          {/* Top row */}
          <BentoGridItem className={`${bentos[0].className} flex flex-col items-start justify-between border shadow animate-fade-in`}>
            <span className="text-xs text-blue-500 font-semibold mb-1">{bentos[0].label}</span>
            <div className="font-bold text-lg text-gray-800 mb-1">{bentos[0].description}</div>
            <img src={bentos[0].icon} alt="" className="h-10 mt-auto rounded-lg" loading="lazy" />
          </BentoGridItem>
          <BentoGridItem className={`${bentos[1].className} flex flex-col items-start border shadow animate-fade-in`}>
            <span className="text-xs">{bentos[1].value}</span>
            <div className="text-3xl font-extrabold">{bentos[1].metric}</div>
            <div className="font-medium text-xs">{bentos[1].description}</div>
          </BentoGridItem>
          <BentoGridItem className={`${bentos[2].className} flex flex-col items-start border shadow animate-fade-in`}>
            <div className="text-xl font-bold">{bentos[2].metric}</div>
            <div className="font-medium text-xs mt-1">{bentos[2].description}</div>
            <span className="text-xs mt-auto">{bentos[2].label}</span>
          </BentoGridItem>

          {/* Left */}
          <BentoGridItem className={`${bentos[3].className} flex flex-col items-start border shadow animate-fade-in`}>
            <div className="text-2xl font-extrabold">{bentos[3].metric}</div>
            <div className="font-medium text-xs">{bentos[3].description}</div>
            <span className="text-xs mt-auto">{bentos[3].label}</span>
          </BentoGridItem>
          {/* Center (Main Hero Visual) */}
          <BentoGridItem className={`${bentos[4].className} border shadow-lg flex flex-col items-center justify-center animate-fade-in`}>
            <img
              src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
              alt="Main Dashboard"
              className="w-full max-w-sm min-h-[6rem] object-cover rounded-2xl shadow-lg mb-4"
              loading="eager"
            />
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-purple-700 text-center mb-4">
              Resource Planning <span className="text-brand-primary">for Studios</span>
            </h1>
            <p className="text-lg text-gray-600 text-center mb-5">
              Spot bottlenecks, balance workloads, and plan projects with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
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
                {/* Could use Lucide icon here */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" fill="currentColor" /></svg>
                Watch Demo
              </button>
            </div>
          </BentoGridItem>
          {/* Right */}
          <BentoGridItem className={`${bentos[5].className} flex flex-col items-start border shadow animate-fade-in`}>
            <span className="text-xs mb-1">{bentos[5].label}</span>
            <div className="text-2xl font-bold">{bentos[5].metric}</div>
            <div className="text-xs">{bentos[5].description}</div>
            <img src={bentos[5].icon} alt="" className="h-8 mt-auto rounded" loading="lazy" />
          </BentoGridItem>
          {/* Bottom row */}
          <BentoGridItem className={`${bentos[6].className} flex flex-col items-start border shadow animate-fade-in`}>
            <div className="text-xs">{bentos[6].label}</div>
            <div className="font-bold text-lg text-orange-600">{bentos[6].description}</div>
          </BentoGridItem>
          <BentoGridItem className={`${bentos[7].className} flex flex-col items-center border shadow animate-fade-in`}>
            <div className="text-2xl font-extrabold">{bentos[7].metric}</div>
            <div className="text-xs">{bentos[7].description}</div>
            <span className="text-xs mt-auto">{bentos[7].label}</span>
          </BentoGridItem>
          <BentoGridItem className={`${bentos[8].className} flex flex-col items-center border shadow animate-fade-in`}>
            <div className="text-2xl font-bold">{bentos[8].metric}</div>
            <div className="text-xs">{bentos[8].description}</div>
            <span className="text-xs mt-auto">{bentos[8].label}</span>
          </BentoGridItem>
        </BentoGrid>
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

