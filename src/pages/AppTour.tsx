import React from 'react';
import Navbar from '../components/landing/Navbar';
import { InteractiveAppTour } from '../components/tour/InteractiveAppTour';
import Footer from '../components/landing/Footer';

const AppTourPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar />
      <div className="py-16 md:py-24">
        <InteractiveAppTour />
      </div>
      <Footer />
    </div>
  );
};

export default AppTourPage;