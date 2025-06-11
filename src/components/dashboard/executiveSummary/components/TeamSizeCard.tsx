
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserPlus } from 'lucide-react';

interface TeamSizeCardProps {
  activeResources: number;
  utilizationRate: number;
  totalTeamMembers?: number;
  preRegisteredCount?: number;
}

export const TeamSizeCard: React.FC<TeamSizeCardProps> = ({
  activeResources,
  utilizationRate,
  totalTeamMembers = activeResources,
  preRegisteredCount = 0
}) => {
  const totalMembers = activeResources + preRegisteredCount;
  
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalMembers}</p>
            
            {/* Enhanced breakdown */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Active</span>
                </div>
                <span className="font-medium text-gray-900">{activeResources}</span>
              </div>
              
              {preRegisteredCount > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="h-3 w-3 text-orange-600" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="font-medium text-gray-900">{preRegisteredCount}</span>
                </div>
              )}
            </div>
            
            {/* Status badge */}
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
              </Badge>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 ml-2">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
