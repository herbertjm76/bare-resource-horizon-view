
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemOutcome from '../components/landing/ProblemOutcome';
import FeatureTrio from '../components/landing/FeatureTrio';

import Pricing from '../components/landing/Pricing';
import LeadMagnet from '../components/landing/LeadMagnet';
import FAQ from '../components/landing/FAQ';
import SignUpSection from '../components/landing/SignUpSection';
import FooterCTA from '../components/landing/FooterCTA';
import Footer from '../components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemOutcome />
      
      <div id="features">
        <FeatureTrio />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      
      <LeadMagnet />
      <FAQ />
      
      <div id="signup">
        <SignUpSection />
      </div>
      
      <FooterCTA />
      <Footer />
    </div>
  );
};

export default Index;
