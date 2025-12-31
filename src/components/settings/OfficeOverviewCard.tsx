
import React from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { Card } from '@/components/ui/card';
import { CompanyLogoSection } from './office-overview/CompanyLogoSection';
import { CompanyInfoDisplay } from './office-overview/CompanyInfoDisplay';
import { OfficeMapSection } from './office-overview/OfficeMapSection';

export const OfficeOverviewCard = () => {
  const { company, refreshCompany } = useCompany();
  const { locations } = useOfficeSettings();

  return (
    <Card className="bg-gradient-to-r from-card-gradient-start to-card-gradient-end border-[3px] border-card-gradient-border rounded-xl shadow-sm p-6">
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
              onUpdate={refreshCompany}
            />
          </div>
        </div>

        {/* Map Section - 3/4 width */}
        <OfficeMapSection
          locations={locations}
          company={company}
        />
      </div>
    </Card>
  );
};
