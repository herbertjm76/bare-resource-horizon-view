
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
  totalRevenue?: number;
  avgProjectValue?: number;
  staffData?: Array<{
    id: string;
    name: string;
    availability: number;
    weekly_capacity?: number;
  }>;
  standardizedUtilizationRate?: number;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends,
  selectedTimeRange,
  totalRevenue = 0,
  avgProjectValue = 0,
  staffData = [],
  standardizedUtilizationRate
}) => {
  const getUtilizationStatus = (rate: number) => {
    if (rate > 90) return { color: 'destructive', label: 'Over Capacity' };
    if (rate > 65) return { color: 'default', label: 'Optimally Allocated' };
    return { color: 'outline', label: 'Ready for Projects' };
  };

  // Use standardized utilization rate if provided, otherwise fall back to legacy calculation
  const utilizationRate = standardizedUtilizationRate !== undefined 
    ? standardizedUtilizationRate 
    : (() => {
        // Legacy fallback calculation
        switch (selectedTimeRange) {
          case 'week': return utilizationTrends.days7;
          case 'month': return utilizationTrends.days30;
          case '3months': 
          case '4months':
          case '6months':
          case 'year':
            return utilizationTrends.days90;
          default: return utilizationTrends.days30;
        }
      })();

  const utilizationStatus = getUtilizationStatus(utilizationRate);

  // Format time range for display
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'Selected Period';
    }
  };

  // Calculate available capacity based on standardized utilization
  const getCapacityHours = () => {
    const multiplier = (() => {
      switch (selectedTimeRange) {
        case 'week': return 1;
        case 'month': return 4;
        case '3months': return 12;
        case '4months': return 16;
        case '6months': return 24;
        case 'year': return 48;
        default: return 4;
      }
    })();

    let totalCapacity: number;
    
    if (staffData.length > 0) {
      // Calculate based on actual staff data
      totalCapacity = staffData.reduce((sum, member) => {
        return sum + (member.weekly_capacity || 40) * multiplier;
      }, 0);
    } else {
      // Fallback to basic calculation
      totalCapacity = activeResources * 40 * multiplier;
    }

    const totalAllocated = totalCapacity * (utilizationRate / 100);
    const availableCapacity = totalCapacity - totalAllocated;
    
    return Math.round(availableCapacity);
  };

  const capacityHours = getCapacityHours();
  const isOverCapacity = capacityHours < 0;

  console.log('Executive Summary Card Data (Standardized):', {
    selectedTimeRange,
    activeProjects,
    activeResources,
    utilizationRate,
    standardizedUtilizationRate,
    totalRevenue,
    avgProjectValue,
    capacityHours,
    isOverCapacity,
    staffDataCount: staffData.length
  });

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

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {isOverCapacity ? 'Over Capacity' : 'Available Capacity'}
                </p>
                <p className={`text-2xl font-bold mb-1 ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
                  {Math.abs(capacityHours).toLocaleString()}h
                </p>
                <p className="text-xs font-medium text-gray-500">{getTimeRangeText()}</p>
              </div>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isOverCapacity ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <Clock className={`h-5 w-5 ${isOverCapacity ? 'text-red-600' : 'text-blue-600'}`} />
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
                <p className="text-xs font-medium text-gray-500">
                  {activeResources > 0 
                    ? `${(activeProjects / activeResources).toFixed(1)} per person` 
                    : 'No team members'}
                </p>
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
                  {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
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
