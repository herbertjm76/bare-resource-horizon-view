import React from 'react';
import { Clock } from 'lucide-react';

interface OverCapacityCardProps {
  overCapacityHours: number;
}

export const OverCapacityCard: React.FC<OverCapacityCardProps> = ({
  overCapacityHours
}) => {
  return (
    <div className="glass-card p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Over Capacity
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-bold text-foreground">
          {overCapacityHours}h
        </div>
        
        <div className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
          Over Capacity
        </div>
        
        <div className="text-sm text-muted-foreground">
          This Month
        </div>
      </div>
    </div>
  );
};