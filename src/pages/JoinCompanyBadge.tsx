
import React from 'react';
import { Building2 } from 'lucide-react';

interface JoinCompanyBadgeProps {
  companyName: string;
  logoUrl?: string | null;
}

const JoinCompanyBadge: React.FC<JoinCompanyBadgeProps> = ({ companyName, logoUrl }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 border border-white/30">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${companyName} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <Building2 className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="text-left">
          <p className="text-xs text-white/60 font-medium uppercase tracking-wide">Joining</p>
          <p className="text-sm text-white font-semibold">{companyName}</p>
        </div>
      </div>
    </div>
  );
};

export default JoinCompanyBadge;
