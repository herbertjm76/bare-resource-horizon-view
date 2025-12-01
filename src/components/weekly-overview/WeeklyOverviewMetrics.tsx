
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, TrendingUp, Calendar } from 'lucide-react';

interface WeeklyOverviewMetricsProps {
  data: {
    allMembers: Array<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      location: string;
      weekly_capacity: number;
      avatar_url: any;
      status: string;
    }>;
    projects: Array<{
      id: string;
      name: string;
      code: string;
    }>;
    getMemberTotal: (memberId: string) => number;
    getProjectCount: (memberId: string) => number;
    getWeeklyLeave: (memberId: string) => number;
  };
  selectedWeek: Date;
}

export const WeeklyOverviewMetrics: React.FC<WeeklyOverviewMetricsProps> = ({ 
  data, 
  selectedWeek 
}) => {
  const calculateWeeklyMetrics = () => {
    if (!data.allMembers || data.allMembers.length === 0) {
      return {
        totalCapacity: 0,
        totalAllocated: 0,
        utilizationRate: 0,
        overloadedMembers: 0,
        underUtilizedMembers: 0,
        availableHours: 0
      };
    }

    let totalCapacity = 0;
    let totalAllocated = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    data.allMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += weeklyCapacity;

      const memberTotal = data.getMemberTotal(member.id);
      totalAllocated += memberTotal;

      const memberUtilization = weeklyCapacity > 0 ? (memberTotal / weeklyCapacity) * 100 : 0;
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalAllocated);

    return {
      totalCapacity,
      totalAllocated,
      utilizationRate,
      overloadedMembers,
      underUtilizedMembers,
      availableHours
    };
  };

  const metrics = calculateWeeklyMetrics();

  return (
    <div className="w-full mx-auto bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-2 sm:p-3 border border-purple-100/50 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
        <Card className="bg-white border border-gray-100 rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
          <CardContent className="p-1.5 sm:p-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mb-1">
              <div className="p-0.5 sm:p-1 rounded-full text-theme-primary bg-theme-primary/10 flex-shrink-0">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </div>
              <p className="font-medium text-gray-700 text-xs leading-tight truncate">Week Utilization</p>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                {metrics.utilizationRate}%
              </div>
              <div className={`text-xs px-1 py-0.5 h-3.5 ml-1 flex-shrink-0 rounded ${
                metrics.utilizationRate > 85 ? 'bg-orange-500 text-white' : 
                metrics.utilizationRate > 70 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {metrics.utilizationRate > 85 ? 'High' : metrics.utilizationRate > 70 ? 'Optimal' : 'Low'}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-tight">
              {metrics.totalAllocated}h / {metrics.totalCapacity}h
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-100 rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
          <CardContent className="p-1.5 sm:p-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mb-1">
              <div className="p-0.5 sm:p-1 rounded-full text-theme-primary bg-theme-primary/10 flex-shrink-0">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </div>
              <p className="font-medium text-gray-700 text-xs leading-tight truncate">Available Hours</p>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                {Math.round(metrics.availableHours)}h
              </div>
              <div className="bg-blue-500 text-white text-xs px-1 py-0.5 h-3.5 ml-1 flex-shrink-0 rounded">
                Available
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-tight">This week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-100 rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
          <CardContent className="p-1.5 sm:p-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mb-1">
              <div className="p-0.5 sm:p-1 rounded-full text-theme-primary bg-theme-primary/10 flex-shrink-0">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </div>
              <p className="font-medium text-gray-700 text-xs leading-tight truncate">Overloaded</p>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                {metrics.overloadedMembers}
              </div>
              <div className={`text-xs px-1 py-0.5 h-3.5 ml-1 flex-shrink-0 rounded ${
                metrics.overloadedMembers > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {metrics.overloadedMembers > 0 ? 'Alert' : 'Good'}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-tight">Over 100% capacity</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-100 rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
          <CardContent className="p-1.5 sm:p-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mb-1">
              <div className="p-0.5 sm:p-1 rounded-full text-theme-primary bg-theme-primary/10 flex-shrink-0">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </div>
              <p className="font-medium text-gray-700 text-xs leading-tight truncate">Under-utilized</p>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                {metrics.underUtilizedMembers}
              </div>
              <div className={`text-xs px-1 py-0.5 h-3.5 ml-1 flex-shrink-0 rounded ${
                metrics.underUtilizedMembers > 0 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {metrics.underUtilizedMembers > 0 ? 'Review' : 'Good'}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-tight">Under 60% capacity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
