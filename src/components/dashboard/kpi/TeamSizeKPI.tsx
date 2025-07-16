import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface TeamSizeKPIProps {
  teamSize?: number;
  recommendHiring?: boolean;
}

export const TeamSizeKPI: React.FC<TeamSizeKPIProps> = ({
  teamSize = 1,
  recommendHiring = true
}) => {
  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">TEAM SIZE</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{teamSize}</p>
            <Badge className="text-xs glass-card border-white/20 text-orange-400 bg-orange-500/20">
              {recommendHiring ? 'Consider Hiring' : 'Stable'}
            </Badge>
            <p className="text-sm font-medium text-white/80">Active resources</p>
          </div>
          <div className="h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3">
            <Users className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};