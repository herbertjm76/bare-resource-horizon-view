
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
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">Utilization</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{Math.round(utilizationRate)}%</p>
            <Badge className={`text-xs glass-card border-white/20 text-white/90 ${utilizationStatus.color}`}>
              {utilizationStatus.label}
            </Badge>
          </div>
          <div className="h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3">
            <TrendingUp className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
