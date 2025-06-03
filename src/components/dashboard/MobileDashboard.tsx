
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, DollarSign } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { HolidayCard } from './HolidayCard';
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

  return (
    <div className="space-y-6 p-4">
      {/* CEO Priority 1: Business Health Overview */}
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

      {/* CEO Priority 2: Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-brand-violet/60" />
            </div>
            <p className="text-xl font-bold text-brand-violet">{activeProjects}</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-brand-violet/60" />
            </div>
            <p className="text-xl font-bold text-brand-violet">{activeResources}</p>
            <p className="text-sm text-gray-600">Team Members</p>
          </CardContent>
        </Card>
      </div>

      {/* CEO Priority 3: Upcoming Holidays */}
      <HolidayCard />

      {/* CEO Priority 4: Smart Insights */}
      <EnhancedInsights 
        utilizationRate={currentUtilizationRate}
        teamSize={activeResources}
        activeProjects={activeProjects}
        selectedTimeRange={selectedTimeRange}
      />

      {/* CEO Priority 5: AI Planning Assistant */}
      <ResourcePlanningChat 
        teamSize={teamMembers.length}
        activeProjects={activeProjects}
        utilizationRate={currentUtilizationRate}
      />
    </div>
  );
};
