
import React from 'react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { CompanyLogoSection } from './office-overview/CompanyLogoSection';
import { CompanyInfoDisplay } from './office-overview/CompanyInfoDisplay';
import { OfficeMapSection } from './office-overview/OfficeMapSection';

export const OfficeOverviewCard = () => {
  const { company, refreshCompany } = useCompany();
  const { locations } = useOfficeSettings();

  return (
    <div 
      className="rounded-3xl p-5 border-2"
      style={{
        background: 'linear-gradient(to right, #eef2ff, #fdf2ff)',
        borderImage: 'linear-gradient(to right, #eef2ff, #fdf2ff) 1',
        borderColor: 'transparent'
      }}
    >
      <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-elevation-2 transition-all duration-300 hover:bg-white/25 hover:shadow-elevation-3">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 h-64">
            {/* Logo and Company Info Section - 1/4 width */}
            <div className="col-span-1 flex flex-col justify-center space-y-3">
              <div className="flex flex-col items-center space-y-3">
                <CompanyLogoSection
                  company={company}
                  onLogoUpdate={refreshCompany}
                />
                <CompanyInfoDisplay
                  company={company}
                  locations={locations}
                />
              </div>
            </div>

            {/* Map Section - 3/4 width */}
            <OfficeMapSection
              locations={locations}
              company={company}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
