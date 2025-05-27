
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { HolidayCard } from './HolidayCard';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { AnalyticsSection } from './AnalyticsSection';
import { HerbieFloatingButton } from './HerbieFloatingButton';

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
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData
}) => {
  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 100%)'
    }}>
      {/* Floating glass orbs for ambiance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl" />
      </div>

      <div className="space-y-8 p-6 relative z-10">
        {/* CEO Priority 1: Executive Summary */}
        <ExecutiveSummaryCard
          activeProjects={activeProjects}
          activeResources={activeResources}
          utilizationTrends={utilizationTrends}
        />

        {/* CEO Priority 2: Three Column Layout - Smart Insights, Staff Status & Holidays */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Smart Insights - Fixed Height with Scroll */}
          <div className="lg:col-span-1">
            <Card className="h-[400px] flex flex-col bg-white/30 backdrop-blur-md border border-white/20 shadow-xl">
              <CardHeader className="pb-4 flex-shrink-0 bg-white/10 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
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
            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
              <StaffStatusCard staffData={staffData} />
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="lg:col-span-1">
            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
              <HolidayCard />
            </div>
          </div>
        </div>

        {/* CEO Priority 3: Analytics & Business Metrics */}
        <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-xl">
          <AnalyticsSection mockData={mockData} />
        </div>

        {/* Floating Herbie Button */}
        <HerbieFloatingButton />
      </div>
    </div>
  );
};
