
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Benefits from '../components/landing/Benefits';
import Pricing from '../components/landing/Pricing';
import SignUpSection from '../components/landing/SignUpSection';
import Footer from '../components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Pricing />
      
      <div id="signup">
        <SignUpSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
