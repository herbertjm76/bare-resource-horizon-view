import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
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
import FloatingInsightCards from '../components/landing/FloatingInsightCards';

// Dashboard image for hero (uploaded custom)
const HERO_DASHBOARD_SRC = "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png";

const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-brand-violet-light via-white to-pink-100/30">
    <Navbar />
    {/* Split Hero Section */}
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-white/90 to-pink-100/40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-0 min-h-[80vh] items-center">
          {/* Left: Hero Content */}
          <div className="w-full md:w-1/3 flex flex-col justify-center items-start md:items-start text-left space-y-7 md:pr-6">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur px-4 py-2 rounded-full text-sm text-brand-primary font-medium mb-4">
              1,000+ studios elevated
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-primary leading-tight font-sans tracking-tight drop-shadow">
              End Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-blue-300">Chaos</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-3 max-w-lg">
              Balance capacity. <span className="text-pink-400 font-semibold">Spot bottlenecks</span>. <span className="text-blue-400 font-semibold">Deliver on time</span>.
              <br className="hidden sm:block" />
              Visualize people & projects in one space—clarity for your whole team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md">
              <button
                onClick={() => {
                  const el = document.getElementById('signup');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-gradient-to-r from-brand-primary to-brand-violet text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-xl hover:bg-brand-violet-light hover:text-brand-primary transition-all duration-200 border-2 border-white/90 hover:scale-105"
              >
                Start Free Trial
              </button>
              <button className="bg-white/10 border border-white/30 text-brand-primary font-semibold py-4 px-8 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" />
                </svg>
                Watch Demo (2 min)
              </button>
            </div>
            <div className="text-sm text-gray-400 mt-4">No credit card required • 2-min setup</div>
          </div>
          {/* Right: Dashboard Image and Floating Insight Cards */}
          <div className="w-full md:w-2/3 flex justify-center items-center relative h-[500px] md:h-[600px] px-4 md:px-8">
            {/* Dashboard Image centered and larger */}
            <div className="relative z-10 w-full h-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white/45 border border-brand-primary/10">
              <img
                src={HERO_DASHBOARD_SRC}
                alt="Dashboard screenshot"
                className="object-cover w-full h-full rounded-3xl shadow-2xl"
              />
            </div>
            {/* 9 Floating insight cards, absolutely positioned */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 21 }}>
              <FloatingInsightCards
                utilizationRate={88}
                teamSize={9}
                activeProjects={13}
                timeRange="month"
              />
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
