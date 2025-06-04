
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { IntelligentInsights } from './IntelligentInsights';
import { HolidayCard } from './HolidayCard';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { Gauge } from './Gauge';
import { TimeRange } from './TimeRangeSelector';
import { HerbieFloatingButton } from './HerbieFloatingButton';

interface MobileDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: any[];
  mockData: any;
  selectedTimeRange?: TimeRange;
  standardizedUtilizationRate?: number;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData,
  selectedTimeRange = 'week',
  standardizedUtilizationRate
}) => {
  // Use standardized utilization rate if available, otherwise fall back to trends
  const currentUtilizationRate = standardizedUtilizationRate !== undefined 
    ? standardizedUtilizationRate 
    : utilizationTrends.days7;

  // Transform staffData to match StaffMember interface
  const transformedStaffData = staffData.map(member => ({
    ...member,
    first_name: member.first_name || member.name.split(' ')[0] || '',
    last_name: member.last_name || member.name.split(' ').slice(1).join(' ') || '',
    role: member.role || 'Member'
  }));

  return (
    <div className="space-y-6 p-4">
      {/* Key Metrics - Single Line */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-white border-gray-200/50">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-brand-violet/60" />
            </div>
            <p className="text-lg font-bold text-brand-violet">{currentUtilizationRate}%</p>
            <p className="text-xs text-gray-600">Utilization</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200/50">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-4 w-4 text-brand-violet/60" />
            </div>
            <p className="text-lg font-bold text-brand-violet">{activeProjects}</p>
            <p className="text-xs text-gray-600">Projects</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200/50">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-brand-violet/60" />
            </div>
            <p className="text-lg font-bold text-brand-violet">{activeResources}</p>
            <p className="text-xs text-gray-600">Team</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200/50">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-brand-violet/60" />
            </div>
            <p className="text-lg font-bold text-brand-violet">2,340h</p>
            <p className="text-xs text-gray-600">Capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards - 2 Column Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Smart Insights */}
        <div>
          <IntelligentInsights 
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={currentUtilizationRate}
          />
        </div>
        
        {/* Staff Status */}
        <div>
          <StaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Upcoming Holidays */}
        <HolidayCard />
      </div>

      {/* Utilization Gauges - 2 Column Grid */}
      <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-brand-violet flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Team Utilization Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <Gauge
                value={utilizationTrends.days7}
                max={100}
                title="7-Day Utilization"
                size="lg"
                thresholds={{ good: 60, warning: 80, critical: 90 }}
              />
            </div>
            <div className="text-center">
              <Gauge
                value={utilizationTrends.days30}
                max={100}
                title="30-Day Utilization"
                size="lg"
                thresholds={{ good: 60, warning: 80, critical: 90 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
