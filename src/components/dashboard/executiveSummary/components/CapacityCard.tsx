
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface CapacityCardProps {
  capacityHours: number;
  isOverCapacity: boolean;
  timeRangeText: string;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({
  capacityHours,
  isOverCapacity,
  timeRangeText
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">
              {isOverCapacity ? 'Over Capacity' : 'Available'}
            </p>
            <p className={`text-2xl font-bold mb-0.5 ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
              {Math.abs(capacityHours).toLocaleString()}h
            </p>
            <p className="text-xs font-medium text-gray-500">{timeRangeText}</p>
          </div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${
            isOverCapacity ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Clock className={`h-4 w-4 ${isOverCapacity ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
