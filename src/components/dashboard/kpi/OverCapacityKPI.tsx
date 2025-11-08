import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Clock } from 'lucide-react';

interface OverCapacityKPIProps {
  overCapacityHours?: number;
}

export const OverCapacityKPI: React.FC<OverCapacityKPIProps> = ({
  overCapacityHours = 624
}) => {
  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">OVER CAPACITY</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{overCapacityHours}h</p>
            <StandardizedBadge variant="error" size="sm" className="glass-card border-white/20">
              Over Capacity
            </StandardizedBadge>
            <p className="text-sm font-medium text-white/80">This Month</p>
          </div>
          <div className="h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3">
            <Clock className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};