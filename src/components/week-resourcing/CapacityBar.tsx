
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CapacityBarProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({ 
  availableHours, 
  totalCapacity 
}) => {
  const usedHours = totalCapacity - availableHours;
  const utilization = totalCapacity > 0 ? (usedHours / totalCapacity) * 100 : 0;
  
  return (
    <div className="w-16 space-y-1">
      <Progress 
        value={Math.min(utilization, 100)} 
        className="h-2"
      />
      <div className="text-xs text-center text-gray-600">
        {Math.round(utilization)}%
      </div>
    </div>
  );
};
