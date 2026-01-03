
import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';

const LeadMagnet = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <VisualCard className="text-center p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground">Free Resource Planner Excel</h3>
                <p className="text-muted-foreground">Excel template + 5-step guide</p>
              </div>
            </div>
            
            <p className="text-lg text-foreground mb-6 max-w-2xl mx-auto">
              See how the manual way works, then discover how BareResource does it in one click. 
              Auto-email series shows you the faster path.
            </p>
            
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto">
              <Download className="w-5 h-5 mr-2" />
              Download Kit
            </button>
          </VisualCard>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default LeadMagnet;
