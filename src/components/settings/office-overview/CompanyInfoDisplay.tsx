
import React from 'react';

interface CompanyInfoDisplayProps {
  company: any;
  locations: any[] | null;
}

export const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({
  company,
  locations
}) => {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-white leading-tight">
        {company?.name || 'Your Company'}
      </h2>
      <p className="text-xs text-white/80 mt-1">
        {company?.address ? `${company.address}` : 'Address not set'}
      </p>
      {company?.city && company?.country && (
        <p className="text-xs text-white/70 mt-1">
          {company.city}, {company.country}
        </p>
      )}
      {locations && locations.length > 0 && (
        <p className="text-xs text-white/70 mt-2">
          {locations.length} office location{locations.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
