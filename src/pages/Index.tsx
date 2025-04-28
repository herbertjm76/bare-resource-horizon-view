
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import SignUpSection from '../components/landing/SignUpSection';
import Footer from '../components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />
      <Hero />
      <Features />
      <SignUpSection />
      <Footer />
    </div>
  );
};

export default Index;

