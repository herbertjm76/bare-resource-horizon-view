
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { IntelligentInsights } from './IntelligentInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { HolidayCard } from './HolidayCard';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { Gauge } from './Gauge';
import { TimeRange } from './TimeRangeSelector';

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
      {/* Business Health Overview - Full Width */}
      <Card className="bg-gradient-to-br from-brand-violet/10 to-blue-50 border-brand-violet/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-brand-violet flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Business Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-violet">{currentUtilizationRate}%</p>
              <p className="text-sm text-gray-600">Team Utilization</p>
              <Badge variant={currentUtilizationRate > 85 ? "destructive" : currentUtilizationRate > 70 ? "default" : "secondary"} className="text-xs mt-1">
                {currentUtilizationRate > 85 ? "At Capacity" : currentUtilizationRate > 70 ? "Healthy" : "Available"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-violet">2,340h</p>
              <p className="text-sm text-gray-600">Available Capacity</p>
              <Badge variant="outline" className="text-xs mt-1">Next 12 weeks</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights and Staff Status - 2 Column Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Smart Insights - Highlighted Priority */}
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
      </div>

      {/* Utilization Gauges - 2 Column Grid */}
      <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
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
          
          {/* Additional metrics row */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            <Card className="bg-white border border-gray-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-brand-violet/60" />
                </div>
                <p className="text-xl font-bold text-brand-violet">{activeProjects}</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-brand-violet/60" />
                </div>
                <p className="text-xl font-bold text-brand-violet">{activeResources}</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Holidays - Full Width */}
      <HolidayCard />

      {/* AI Planning Assistant - Full Width */}
      <ResourcePlanningChat 
        teamSize={teamMembers.length}
        activeProjects={activeProjects}
        utilizationRate={currentUtilizationRate}
      />
    </div>
  );
};
