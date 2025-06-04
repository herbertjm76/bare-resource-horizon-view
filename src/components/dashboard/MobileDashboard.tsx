
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Briefcase, Calendar, Sparkles } from 'lucide-react';
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

  // Get utilization status and color
  const getUtilizationStatus = (rate: number) => {
    if (rate >= 85) return { status: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
    if (rate >= 70) return { status: 'Optimal', color: 'bg-green-500', textColor: 'text-green-700' };
    if (rate >= 50) return { status: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Low', color: 'bg-gray-400', textColor: 'text-gray-600' };
  };

  const utilizationStatus = getUtilizationStatus(currentUtilizationRate);

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* Header Stats - Quick Overview */}
      <div className="bg-gradient-to-r from-brand-violet to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Team Overview
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-2xl font-bold">{activeResources}</span>
            </div>
            <p className="text-white/80 text-sm">Team Members</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Briefcase className="h-4 w-4 mr-1" />
              <span className="text-2xl font-bold">{activeProjects}</span>
            </div>
            <p className="text-white/80 text-sm">Active Projects</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-2xl font-bold">{currentUtilizationRate}%</span>
            </div>
            <p className="text-white/80 text-sm">Utilization</p>
            <Badge 
              variant="secondary" 
              className="mt-1 bg-white/20 text-white border-white/30 text-xs"
            >
              {utilizationStatus.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Smart Insights - Primary Content */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
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
      
      {/* Team Status - Important Secondary Content */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
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

      {/* Upcoming Events - Tertiary Content */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
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

      {/* Utilization Trends - Detailed Analytics */}
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-brand-violet/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-brand-violet" />
            </div>
            Utilization Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <Gauge
                value={utilizationTrends.days7}
                max={100}
                title="7-Day Average"
                size="lg"
                thresholds={{ good: 60, warning: 80, critical: 90 }}
              />
              <p className="text-sm text-gray-600 mt-2">Current week performance</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {utilizationTrends.days30}%
                </div>
                <div className="text-sm text-gray-600">30-Day Average</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {utilizationTrends.days90}%
                </div>
                <div className="text-sm text-gray-600">90-Day Average</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
