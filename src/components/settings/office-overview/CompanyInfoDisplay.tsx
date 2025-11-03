
import React from 'react';
import { CompanyInfoEditDialog } from './CompanyInfoEditDialog';

interface CompanyInfoDisplayProps {
  company: any;
  locations: any[] | null;
  onUpdate: () => void;
}

export const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({
  company,
  locations,
  onUpdate
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold text-black leading-tight">
          {company?.name || 'Your Company'}
        </h2>
        <CompanyInfoEditDialog company={company} onUpdate={onUpdate} />
      </div>
      <p className="text-xs text-black/80 mt-1">
        {company?.address ? `${company.address}` : 'Address not set'}
      </p>
      {company?.city && company?.country && (
        <p className="text-xs text-black/70 mt-1">
          {company.city}, {company.country}
        </p>
      )}
      {locations && locations.length > 0 && (
        <p className="text-xs text-black/70 mt-2">
          {locations.length} office location{locations.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
