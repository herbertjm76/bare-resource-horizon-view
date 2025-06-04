
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
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">Utilization</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{Math.round(utilizationRate)}%</p>
            <Badge className={`text-xs ${utilizationStatus.color}`}>
              {utilizationStatus.label}
            </Badge>
          </div>
          <div className="h-8 w-8 rounded-full bg-brand-violet/10 flex items-center justify-center flex-shrink-0 ml-2">
            <TrendingUp className="h-4 w-4 text-brand-violet" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
