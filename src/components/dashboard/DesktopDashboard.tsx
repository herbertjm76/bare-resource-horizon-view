
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
    <div className="space-y-6">
      {/* Top Row - Strategic Overview and Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SummaryDashboard 
            title="Strategic Overview"
            metrics={summaryMetrics}
          />
        </div>
        
        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-violet">{activeResources}</p>
                  <p className="text-sm text-gray-600">Active members</p>
                </div>
                <Users size={24} strokeWidth={1.5} className="text-brand-violet/30" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-violet">{activeProjects}</p>
                  <p className="text-sm text-gray-600">Live projects</p>
                </div>
                <Activity size={24} strokeWidth={1.5} className="text-brand-violet/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Insights and Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <EnhancedInsights 
            teamMembers={teamMembers}
            activeProjects={activeProjects}
            utilizationRate={utilizationTrends.days7}
            utilizationTrends={utilizationTrends}
            staffMembers={staffData}
          />
        </div>

        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Utilization</h3>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Gauge 
                  value={utilizationTrends.days7} 
                  max={100} 
                  title="7 Days"
                  size="sm"
                />
              </div>
              <div className="flex justify-center">
                <Gauge 
                  value={utilizationTrends.days30} 
                  max={100} 
                  title="30 Days"
                  size="sm"
                />
              </div>
              <div className="flex justify-center">
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
      </div>

      {/* Third Row - Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStatus} 
              title="Project By Status" 
              colors={['#6F4BF6', '#FFB443']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStage} 
              title="Project By Stage"
              colors={['#6F4BF6', '#FFB443']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByRegion} 
              title="Project By Region"
              colors={['#6F4BF6', '#91D3FF']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4">
            <HolidaysList holidays={mockData.upcomingHolidays} />
          </CardContent>
        </Card>
      </div>

      {/* Fourth Row - Chat and Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourcePlanningChat 
          teamSize={teamMembers.length}
          activeProjects={activeProjects}
          utilizationRate={utilizationTrends.days7}
        />

        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <StaffAvailability staffMembers={staffData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
