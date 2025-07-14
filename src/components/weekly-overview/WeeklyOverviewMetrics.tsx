
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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Week Utilization</p>
              <p className="text-2xl font-bold">{metrics.utilizationRate}%</p>
              <p className="text-xs text-gray-500">{metrics.totalAllocated}h / {metrics.totalCapacity}h</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Available Hours</p>
              <p className="text-2xl font-bold">{Math.round(metrics.availableHours)}h</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Overloaded</p>
              <p className="text-2xl font-bold">{metrics.overloadedMembers}</p>
              <p className="text-xs text-gray-500">Over 100% capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Under-utilized</p>
              <p className="text-2xl font-bold">{metrics.underUtilizedMembers}</p>
              <p className="text-xs text-gray-500">Under 60% capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
