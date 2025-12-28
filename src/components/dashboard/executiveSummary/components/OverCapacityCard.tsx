import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Clock } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface OverCapacityCardProps {
  overCapacityHours: number;
  timeRange: string;
  totalCapacity?: number;
}

export const OverCapacityCard: React.FC<OverCapacityCardProps> = ({
  overCapacityHours,
  timeRange,
  totalCapacity
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = totalCapacity || workWeekHours;
  return (
    <Card className="rounded-xl glass-card glass-hover border-white/20 h-full">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-medium text-white/90 tracking-wider">OVER CAPACITY</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{formatAllocationValue(overCapacityHours, capacity, displayPreference)}</div>
            <div className="w-16 h-1 bg-white/30 rounded-full mx-auto">
              <div className="w-3/4 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <StandardizedBadge variant="error" size="sm" className="glass-card border-white/20">
            Over Capacity
          </StandardizedBadge>
          <span className="text-[10px] text-white/70">{timeRange}</span>
        </div>
      </CardContent>
    </Card>
  );
};