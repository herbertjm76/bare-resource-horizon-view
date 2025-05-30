
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

interface UtilizationCardProps {
  utilizationRate: number;
  utilizationStatus: {
    color: string;
    label: string;
  };
}

export const UtilizationCard: React.FC<UtilizationCardProps> = ({
  utilizationRate,
  utilizationStatus
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 mb-1">Team Utilization</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{Math.round(utilizationRate)}%</p>
            <Badge variant={utilizationStatus.color as any} className="text-xs">
              {utilizationStatus.label}
            </Badge>
          </div>
          <div className="h-10 w-10 rounded-full bg-brand-violet/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-brand-violet" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
