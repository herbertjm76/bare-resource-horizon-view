import React from 'react';
import Navbar from '../components/landing/Navbar';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;