
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { HolidayCard } from './HolidayCard';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { AnalyticsSection } from './AnalyticsSection';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { TimeRange } from './TimeRangeSelector';

interface DesktopDashboardProps {
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
  selectedTimeRange: TimeRange;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData,
  selectedTimeRange
}) => {
  return (
    <div className="space-y-8 p-6 relative">
      {/* CEO Priority 1: Executive Summary */}
      <ExecutiveSummaryCard
        activeProjects={activeProjects}
        activeResources={activeResources}
        utilizationTrends={utilizationTrends}
        selectedTimeRange={selectedTimeRange}
      />

      {/* CEO Priority 2: Three Column Layout - Smart Insights, Staff Status & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Insights - Fixed Height with Scroll */}
        <div className="lg:col-span-1">
          <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-violet" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <EnhancedInsights 
                teamMembers={teamMembers}
                activeProjects={activeProjects}
                utilizationRate={utilizationTrends.days7}
                utilizationTrends={utilizationTrends}
                staffMembers={staffData}
              />
            </CardContent>
          </Card>
        </div>

        {/* Staff Availability & Status */}
        <div className="lg:col-span-1">
          <StaffStatusCard staffData={staffData} />
        </div>

        {/* Upcoming Holidays */}
        <div className="lg:col-span-1">
          <HolidayCard />
        </div>
      </div>

      {/* CEO Priority 3: Analytics & Business Metrics */}
      <AnalyticsSection mockData={mockData} />

      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
