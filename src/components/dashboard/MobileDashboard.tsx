
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Briefcase, Calendar, Sparkles, Target } from 'lucide-react';
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

  // Get utilization status and color
  const getUtilizationStatus = (rate: number) => {
    if (rate >= 85) return { status: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
    if (rate >= 70) return { status: 'Optimal', color: 'bg-green-500', textColor: 'text-green-700' };
    if (rate >= 50) return { status: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Low', color: 'bg-gray-400', textColor: 'text-gray-600' };
  };

  const utilizationStatus = getUtilizationStatus(currentUtilizationRate);

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Quick Stats Overview */}
      <div className="bg-gradient-to-r from-brand-violet to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Dashboard Overview
        </h2>
        
        {/* Stats Grid - Vertical on mobile */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Team Members</p>
                <p className="text-2xl font-bold">{activeResources}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Team Utilization</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{currentUtilizationRate}%</p>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 text-xs"
                  >
                    {utilizationStatus.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-brand-violet/10 rounded-lg">
              <Sparkles className="h-4 w-4 text-brand-violet" />
            </div>
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <IntelligentInsights 
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={currentUtilizationRate}
          />
        </CardContent>
      </Card>
      
      {/* Team Status */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <StaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange}
          />
        </CardContent>
      </Card>

      {/* Performance Gauge - Simplified */}
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-brand-violet/10 rounded-lg">
              <Target className="h-4 w-4 text-brand-violet" />
            </div>
            Current Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Gauge
            value={currentUtilizationRate}
            max={100}
            title="Team Utilization"
            size="lg"
            thresholds={{ good: 60, warning: 80, critical: 90 }}
          />
          <p className="text-sm text-gray-600 mt-4 text-center">
            Current week performance vs capacity
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <HolidayCard />
        </CardContent>
      </Card>

      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
