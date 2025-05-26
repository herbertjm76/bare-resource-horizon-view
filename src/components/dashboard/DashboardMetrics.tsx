
import React, { useState } from 'react';
import { Filter, Activity, Users, Calendar, Clock, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gauge } from './Gauge';
import { Donut } from './Donut';
import { HolidaysList } from './HolidaysList';
import { StaffAvailability } from './StaffAvailability';
import { HerbieChat } from './HerbieChat';
import { SummaryDashboard } from './SummaryDashboard';
import { IntelligentInsights } from './IntelligentInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';

const mockData = {
  activeResources: 96,
  activeProjects: 55,
  utilizationRate: {
    days7: 81,
    days30: 76,
    days90: 82
  },
  staffData: [
    { name: 'Cameron Williamson', role: 'Developer', availability: 85 },
    { name: 'Jenny Wilson', role: 'Designer', availability: 80 },
    { name: 'Ronald Richards', role: 'PM', availability: 75 },
    { name: 'Diane Russell', role: 'Developer', availability: 64 },
  ],
  upcomingHolidays: [
    { date: '2025-04-20', name: 'Memorial Day', offices: ['LDN'] },
    { date: '2025-06-23', name: 'Independence Day', offices: ['DUB'] },
  ],
  projectsByStatus: [
    { name: 'In Progress', value: 70 },
    { name: 'Complete', value: 30 },
  ],
  projectsByStage: [
    { name: '50% CD', value: 50 },
    { name: '50% SD', value: 50 },
  ],
  projectsByRegion: [
    { name: 'India', value: 60 },
    { name: 'Oman', value: 40 },
  ],
  resourcesByOffice: [
    { name: 'London', value: 45 },
    { name: 'Hong Kong', value: 55 },
  ],
  offices: ['All Offices', 'London', 'Dubai', 'Hong Kong', 'New York', 'Mumbai', 'Riyadh', 'Beijing'],
  // Mock team members for insights
  teamMembers: [
    { id: '1', first_name: 'John', last_name: 'Doe', weekly_capacity: 40, job_title: 'Senior Developer' },
    { id: '2', first_name: 'Jane', last_name: 'Smith', weekly_capacity: 40, job_title: 'Designer' },
    { id: '3', first_name: 'Mike', last_name: 'Johnson', weekly_capacity: 35, job_title: 'Project Manager' },
    { id: '4', first_name: 'Sarah', last_name: 'Wilson', weekly_capacity: 40, job_title: 'Developer' },
    { id: '5', first_name: 'Tom', last_name: 'Brown', weekly_capacity: 40, job_title: 'Designer' },
  ]
};

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  // Summary metrics for consolidated dashboard
  const summaryMetrics = [
    {
      title: 'Team Utilization',
      value: '81%',
      subtitle: 'Current 7-day average',
      progress: 81,
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
      value: mockData.activeProjects,
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm text-gray-600 mb-0.5">TODAY IS</h2>
          <p className="text-2xl font-bold">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <Select
            value={selectedOffice}
            onValueChange={setSelectedOffice}
          >
            <SelectTrigger className="w-[180px] bg-white border border-gray-300 text-gray-700">
              <SelectValue placeholder="All Offices" />
            </SelectTrigger>
            <SelectContent>
              {mockData.offices.map((office) => (
                <SelectItem key={office} value={office}>
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Consolidated Summary Dashboard */}
      <SummaryDashboard 
        title="Strategic Overview"
        metrics={summaryMetrics}
        className="mb-6"
      />

      {/* New Intelligent Insights Section */}
      <div className="mb-6">
        <IntelligentInsights 
          teamMembers={mockData.teamMembers}
          activeProjects={mockData.activeProjects}
          utilizationRate={mockData.utilizationRate.days7}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Resource Planning AI Chat - Takes up more space */}
        <div className="col-span-5">
          <ResourcePlanningChat 
            teamSize={mockData.teamMembers.length}
            activeProjects={mockData.activeProjects}
            utilizationRate={mockData.utilizationRate.days7}
          />
        </div>

        {/* Utilization Trends - Condensed */}
        <div className="col-span-4">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-[600px]">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Utilization Trends</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <Gauge 
                    value={mockData.utilizationRate.days7} 
                    max={100} 
                    title="7 Days"
                    size="md"
                  />
                </div>
                <div className="text-center">
                  <Gauge 
                    value={mockData.utilizationRate.days30} 
                    max={100} 
                    title="30 Days"
                    size="md"
                  />
                </div>
                <div className="text-center">
                  <Gauge 
                    value={mockData.utilizationRate.days90} 
                    max={100} 
                    title="90 Days"
                    size="md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Stats */}
        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl mb-4">
            <CardContent className="p-4 flex items-center">
              <div className="space-y-4 flex-grow">
                <div>
                  <p className="text-3xl font-bold text-brand-violet">{mockData.activeResources}</p>
                  <p className="text-sm">Active members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-violet">{mockData.activeProjects}</p>
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

          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4">
              <HolidaysList holidays={mockData.upcomingHolidays} />
            </CardContent>
          </Card>
        </div>

        {/* Staff Availability - Full width */}
        <div className="col-span-12">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-6">
              <StaffAvailability staffMembers={mockData.staffData} />
            </CardContent>
          </Card>
        </div>

        {/* Project Analytics - Smaller cards */}
        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4">
              <Donut 
                data={mockData.projectsByStatus} 
                title="Project By Status" 
                colors={['#6F4BF6', '#FFB443']}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4">
              <Donut 
                data={mockData.projectsByStage} 
                title="Project By Stage"
                colors={['#6F4BF6', '#FFB443']}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4">
              <Donut 
                data={mockData.projectsByRegion} 
                title="Project By Region"
                colors={['#6F4BF6', '#91D3FF']}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4">
              <Donut 
                data={mockData.resourcesByOffice} 
                title="Resource by Office"
                colors={['#FF6B6B', '#91D3FF']}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
