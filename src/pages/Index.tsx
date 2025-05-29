
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import SignUpSection from '../components/landing/SignUpSection';
import Footer from '../components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Placeholder sections for navigation */}
      <div id="benefits" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Benefits</h2>
          <p className="text-xl text-gray-600">This section will showcase the key benefits of using BareResource.</p>
        </div>
      </div>
      
      <div id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Testimonials</h2>
          <p className="text-xl text-gray-600">Customer success stories and testimonials will be displayed here.</p>
        </div>
      </div>
      
      <div id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Pricing</h2>
          <p className="text-xl text-gray-600">Pricing plans and packages will be shown in this section.</p>
        </div>
      </div>
      
      <div id="signup">
        <SignUpSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
