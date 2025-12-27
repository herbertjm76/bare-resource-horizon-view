import React from 'react';
import Navbar from '../components/landing/Navbar';
import { InteractiveAppTour } from '../components/tour/InteractiveAppTour';
import Footer from '../components/landing/Footer';

const AppTourPage = () => {
  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="py-12">
        <InteractiveAppTour />
      </div>
      <Footer />
    </div>
  );
};

export default AppTourPage;