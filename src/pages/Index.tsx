
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemOutcome from '../components/landing/ProblemOutcome';
import FeatureTrio from '../components/landing/FeatureTrio';
import AppTour from '../components/landing/AppTour';

import Pricing from '../components/landing/Pricing';
import LeadMagnet from '../components/landing/LeadMagnet';
import FAQ from '../components/landing/FAQ';
import FooterCTA from '../components/landing/FooterCTA';
import Footer from '../components/landing/Footer';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when coming from other pages
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [location.hash]);
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemOutcome />
      
      <div id="features">
        <FeatureTrio />
      </div>
      
      <AppTour />
      <div id="pricing">
        <Pricing />
      </div>
      
      <LeadMagnet />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  );
};

export default Index;
