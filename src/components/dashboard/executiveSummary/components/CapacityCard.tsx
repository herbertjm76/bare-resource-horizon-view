
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface CapacityCardProps {
  capacityHours: number;
  isOverCapacity: boolean;
  timeRangeText: string;
  totalCapacity?: number;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({
  capacityHours,
  isOverCapacity,
  timeRangeText,
  totalCapacity = 40
}) => {
  const { displayPreference } = useAppSettings();
  
  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">
              {isOverCapacity ? 'Over Capacity' : 'Available'}
            </p>
            <p className={`text-3xl font-bold mb-1 tracking-tight ${isOverCapacity ? 'text-red-300' : 'text-white'}`}>
              {formatAllocationValue(Math.abs(capacityHours), totalCapacity, displayPreference)}
            </p>
            <p className="text-sm font-medium text-white/80">{timeRangeText}</p>
          </div>
          <div className={`h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3 ${
            isOverCapacity ? 'border-red-300/20' : 'border-white/20'
          }`}>
            <Clock className={`h-5 w-5 ${isOverCapacity ? 'text-red-300' : 'text-white/90'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
