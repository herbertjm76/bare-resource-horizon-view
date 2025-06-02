
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

const ExcelComparison = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection animation="fadeInUp">
          <div className="flex items-center justify-center mb-6">
            <FileSpreadsheet className="w-12 h-12 text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Why not Excel?</h2>
          </div>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Excel tracks yesterday. BareResource projects tomorrow, updates itself, and alerts you before trouble.
          </p>
          
          <button 
            onClick={() => scrollToSection('signup')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Import Your Sheet in 10 min
          </button>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ExcelComparison;
