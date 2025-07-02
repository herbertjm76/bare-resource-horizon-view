import React from 'react';
import Navbar from '../components/landing/Navbar';
import AppTour from '../components/landing/AppTour';
import Footer from '../components/landing/Footer';

const AppTourPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AppTour />
      <Footer />
    </div>
  );
};

export default AppTourPage;