
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
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{activeResources}</p>
            <Badge variant="outline" className="text-xs">
              {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
            </Badge>
          </div>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
