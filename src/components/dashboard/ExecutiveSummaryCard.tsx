
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, Briefcase, Users } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

interface ExecutiveSummaryCardProps {
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  selectedTimeRange: TimeRange;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends,
  selectedTimeRange
}) => {
  const getUtilizationStatus = (rate: number) => {
    if (rate > 90) return { color: 'destructive', label: 'At Capacity' };
    if (rate > 65) return { color: 'default', label: 'Optimally Allocated' };
    return { color: 'outline', label: 'Ready for Projects' };
  };

  // Get the appropriate utilization value based on the time range
  const getTimeRangeUtilization = () => {
    switch (selectedTimeRange) {
      case 'week': return utilizationTrends.days7;
      case 'month': return utilizationTrends.days30;
      case '3months': return utilizationTrends.days90;
      default: return utilizationTrends.days30;
    }
  };

  const utilizationRate = getTimeRangeUtilization();
  const utilizationStatus = getUtilizationStatus(utilizationRate);

  // Format time range for display
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      default: return 'Selected Period';
    }
  };

  return (
    <div 
      className="rounded-2xl p-4 border border-brand-violet/10"
      style={{
        background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
      }}
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Executive Summary
        <span className="text-sm font-normal ml-2 bg-white/20 px-2 py-0.5 rounded">
          {getTimeRangeText()}
        </span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">Team Utilization</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{utilizationRate}%</p>
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

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">Available Capacity</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">2,340h</p>
                <p className="text-xs font-medium text-gray-500">Next 12 weeks</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{activeProjects}</p>
                <p className="text-xs font-medium text-gray-500">{(activeProjects / activeResources).toFixed(1)} per person</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{activeResources}</p>
                <Badge variant="outline" className="text-xs">
                  {utilizationTrends.days7 > 85 ? 'Consider Hiring' : 'Stable'}
                </Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
