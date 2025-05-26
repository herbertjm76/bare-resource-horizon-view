
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { SummaryDashboard } from './SummaryDashboard';
import { Gauge } from './Gauge';
import { Donut } from './Donut';
import { HolidaysList } from './HolidaysList';
import { StaffAvailability } from './StaffAvailability';

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
  const summaryMetrics = [
    {
      title: 'Team Utilization',
      value: `${utilizationTrends.days7}%`,
      subtitle: 'Current 7-day average',
      progress: utilizationTrends.days7,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
      status: 'good' as const
    },
    {
      title: 'Available Capacity',
      value: '2,340h',
      subtitle: 'Next 12 weeks',
      icon: <Clock className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: 'Currently in progress',
      icon: <Target className="h-4 w-4" />,
      status: 'good' as const
    },
    {
      title: 'Hiring Status',
      value: 'Monitor',
      subtitle: 'Based on capacity trends',
      icon: <AlertTriangle className="h-4 w-4" />,
      status: 'warning' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
      {/* Strategic Overview - Spans 2 columns on large screens */}
      <div className="lg:col-span-2">
        <SummaryDashboard 
          title="Strategic Overview"
          metrics={summaryMetrics}
        />
      </div>

      {/* Key Stats */}
      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4 flex items-center">
          <div className="space-y-4 flex-grow">
            <div>
              <p className="text-3xl font-bold text-brand-violet">{activeResources}</p>
              <p className="text-sm">Active members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-violet">{activeProjects}</p>
              <p className="text-sm">Live projects</p>
            </div>
          </div>
          <div className="flex flex-col space-y-4 ml-4 opacity-30">
            <Users 
              size={36} 
              strokeWidth={1.5} 
              className="text-brand-violet/30" 
            />
            <Activity 
              size={36} 
              strokeWidth={1.5} 
              className="text-brand-violet/30" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Utilization Trends */}
      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilization Trends</h3>
          <div className="space-y-4">
            <div className="text-center">
              <Gauge 
                value={utilizationTrends.days7} 
                max={100} 
                title="7 Days"
                size="sm"
              />
            </div>
            <div className="text-center">
              <Gauge 
                value={utilizationTrends.days30} 
                max={100} 
                title="30 Days"
                size="sm"
              />
            </div>
            <div className="text-center">
              <Gauge 
                value={utilizationTrends.days90} 
                max={100} 
                title="90 Days"
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Insights - Spans 2 columns */}
      <div className="lg:col-span-2">
        <EnhancedInsights 
          teamMembers={teamMembers}
          activeProjects={activeProjects}
          utilizationRate={utilizationTrends.days7}
          utilizationTrends={utilizationTrends}
          staffMembers={staffData}
        />
      </div>

      {/* Holidays */}
      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <HolidaysList holidays={mockData.upcomingHolidays} />
        </CardContent>
      </Card>

      {/* Resource Planning Chat - Spans 2 columns */}
      <div className="lg:col-span-2">
        <ResourcePlanningChat 
          teamSize={teamMembers.length}
          activeProjects={activeProjects}
          utilizationRate={utilizationTrends.days7}
        />
      </div>

      {/* Project Analytics Cards */}
      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByStatus} 
            title="Project By Status" 
            colors={['#6F4BF6', '#FFB443']}
          />
        </CardContent>
      </Card>

      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByStage} 
            title="Project By Stage"
            colors={['#6F4BF6', '#FFB443']}
          />
        </CardContent>
      </Card>

      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByRegion} 
            title="Project By Region"
            colors={['#6F4BF6', '#91D3FF']}
          />
        </CardContent>
      </Card>

      <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
        <CardContent className="p-4">
          <Donut 
            data={mockData.resourcesByOffice} 
            title="Resource by Office"
            colors={['#FF6B6B', '#91D3FF']}
          />
        </CardContent>
      </Card>

      {/* Staff Availability - Full width */}
      <div className="lg:col-span-3 xl:col-span-4">
        <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
          <CardContent className="p-6">
            <StaffAvailability staffMembers={staffData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
