
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface MobileSummaryCardsProps {
  activeResources: number;
  activeProjects: number;
  utilizationRate: number;
  capacityHours?: number;
  isOverCapacity?: boolean;
  timeRangeText?: string;
}

export const MobileSummaryCards: React.FC<MobileSummaryCardsProps> = ({
  activeResources,
  activeProjects,
  utilizationRate,
  capacityHours = 0,
  isOverCapacity = false,
  timeRangeText = "This period"
}) => {
  const getUtilizationStatus = () => {
    if (utilizationRate >= 90) return { label: 'At Capacity', color: 'bg-red-500 text-white border-red-400' };
    if (utilizationRate >= 75) return { label: 'High', color: 'bg-orange-500 text-white border-orange-400' };
    if (utilizationRate >= 50) return { label: 'Optimal', color: 'bg-green-500 text-white border-green-400' };
    return { label: 'Low', color: 'bg-blue-500 text-white border-blue-400' };
  };

  const utilizationStatus = getUtilizationStatus();

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Team Size Card */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{activeResources}</p>
              <Badge className={utilizationRate > 85 ? 'bg-orange-500 text-white border-orange-400' : 'bg-green-500 text-white border-green-400'}>
                {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
              </Badge>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-violet/10 flex items-center justify-center flex-shrink-0 ml-2">
              <Users className="h-4 w-4 text-brand-violet" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Projects Card */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Projects</p>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{activeProjects}</p>
              <p className="text-xs font-medium text-gray-500">
                {activeResources > 0 
                  ? `${(activeProjects / activeResources).toFixed(1)} per person` 
                  : 'No team'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ml-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Utilization Card */}
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
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ml-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Card */}
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
              isOverCapacity ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <Clock className={`h-4 w-4 ${isOverCapacity ? 'text-red-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
