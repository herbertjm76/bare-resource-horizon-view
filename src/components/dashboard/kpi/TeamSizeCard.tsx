import React from 'react';
import { Users } from 'lucide-react';

interface TeamSizeCardProps {
  totalTeamSize: number;
  activeResources: number;
}

export const TeamSizeCard: React.FC<TeamSizeCardProps> = ({
  totalTeamSize,
  activeResources
}) => {
  const shouldConsiderHiring = totalTeamSize <= 5; // Simple logic for demo

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Team Size
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-bold text-foreground">
          {totalTeamSize}
        </div>
        
        <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
          shouldConsiderHiring 
            ? 'bg-orange-500/10 text-orange-400' 
            : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {shouldConsiderHiring ? 'Consider Hiring' : 'Good Size'}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Active resources
        </div>
      </div>
    </div>
  );
};