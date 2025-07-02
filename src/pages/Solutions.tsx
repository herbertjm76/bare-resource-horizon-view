import React from 'react';
import Navbar from '../components/landing/Navbar';
import Solutions from '../components/landing/Solutions';
import Footer from '../components/landing/Footer';

const SolutionsPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Solutions />
      <Footer />
    </div>
  );
};

export default SolutionsPage;