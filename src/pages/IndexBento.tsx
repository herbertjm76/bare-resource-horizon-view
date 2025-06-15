
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { BentoGrid, BentoGridItem } from '../components/landing/BentoGrid';
import Hero from '../components/landing/Hero';
import ProblemOutcome from '../components/landing/ProblemOutcome';
import FeatureTrio from '../components/landing/FeatureTrio';
import ExcelComparison from '../components/landing/ExcelComparison';
import LeadMagnet from '../components/landing/LeadMagnet';
import FAQ from '../components/landing/FAQ';
import SignUpSection from '../components/landing/SignUpSection';
import FooterCTA from '../components/landing/FooterCTA';
import Pricing from '../components/landing/Pricing';

const IndexBento = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Navbar />
    {/* Hero full width, row 1 */}
    <BentoGrid>
      <BentoGridItem className="md:col-span-6 md:row-span-1">{/* Hero, full width */}
        <Hero />
      </BentoGridItem>

      {/* Big Feature block left */}
      <BentoGridItem className="md:col-span-4 md:row-span-2 row-start-2 col-start-1">
        <FeatureTrio />
      </BentoGridItem>

      {/* ProblemOutcome block, right (stacked on mobile) */}
      <BentoGridItem className="md:col-span-2 md:row-span-1 md:row-start-2 md:col-start-5">
        <ProblemOutcome />
      </BentoGridItem>
      {/* Excel vs BR - compressed on the right */}
      <BentoGridItem className="md:col-span-2 md:row-span-1 md:row-start-3 md:col-start-5">
        <ExcelComparison />
      </BentoGridItem>

      {/* Pricing, bottom left */}
      <BentoGridItem className="md:col-span-2 md:row-span-1 md:row-start-4 md:col-start-1">
        <Pricing />
      </BentoGridItem>
      {/* Lead Magnet, bottom middle */}
      <BentoGridItem className="md:col-span-2 md:row-span-1 md:row-start-4 md:col-start-3">
        <LeadMagnet />
      </BentoGridItem>
      {/* Sign up section, bottom right */}
      <BentoGridItem className="md:col-span-2 md:row-span-1 md:row-start-4 md:col-start-5">
        <SignUpSection />
      </BentoGridItem>
      {/* Footer CTA and FAQ - full width bottom */}
      <BentoGridItem className="md:col-span-6 md:row-span-1">
        <FooterCTA />
        <FAQ />
        <Footer />
      </BentoGridItem>
    </BentoGrid>
  </div>
);

export default IndexBento;
