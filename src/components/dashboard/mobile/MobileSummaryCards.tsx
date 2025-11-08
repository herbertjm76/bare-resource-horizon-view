
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

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
  // Pastel colors for status indicators
  const getUtilizationStatus = () => {
    if (utilizationRate >= 90) return { label: 'At Capacity', color: 'bg-red-200 text-red-800 border-red-300' }; // Pastel red
    if (utilizationRate >= 75) return { label: 'High', color: 'bg-orange-200 text-orange-800 border-orange-300' }; // Pastel orange
    if (utilizationRate >= 50) return { label: 'Optimal', color: 'bg-green-200 text-green-800 border-green-300' }; // Pastel green
    return { label: 'Low', color: 'bg-yellow-200 text-yellow-800 border-yellow-300' }; // Pastel yellow
  };

  const utilizationStatus = getUtilizationStatus();

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Team Size Card - Brand violet */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{activeResources}</p>
              <StandardizedBadge 
                variant={utilizationRate > 85 ? "warning" : "success"} 
                size="sm"
              >
                {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
              </StandardizedBadge>
            </div>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600 flex items-center justify-center flex-shrink-0 ml-2">
              <Users className="h-4 w-4 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Projects Card - Brand blue */}
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
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 ml-2">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Team Utilization Card - Pastel status colors */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-1">Utilization</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{Math.round(utilizationRate)}%</p>
                <StandardizedBadge 
                  variant={
                    utilizationRate >= 90 ? "error" :
                    utilizationRate >= 75 ? "warning" :
                    utilizationRate >= 50 ? "success" :
                    "secondary"
                  } 
                  size="sm"
                >
                  {utilizationStatus.label}
                </StandardizedBadge>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Capacity Card - Brand colors with pastel status indication */}
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
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 ml-2 ${
                isOverCapacity ? 'from-red-400 to-red-500' : 'from-orange-400 to-orange-500'
              }`}>
                <Clock className={`h-4 w-4 text-white`} />
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};
