
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface TeamSizeCardProps {
  activeResources: number;
  utilizationRate: number;
}

export const TeamSizeCard: React.FC<TeamSizeCardProps> = ({
  activeResources,
  utilizationRate
}) => {
  return (
    <Card className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">TEAM SIZE</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{activeResources}</p>
            <Badge className="text-xs border-white/20 text-white/90 bg-white/10">
              {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
            </Badge>
            <p className="text-sm font-medium text-white/80">Active resources</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 ml-3">
            <Users className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
