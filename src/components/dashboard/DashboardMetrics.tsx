
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';

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
  const isMobile = useIsMobile();
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xs sm:text-sm text-gray-600 mb-0.5">TODAY IS</h2>
            <p className="text-lg sm:text-2xl font-bold">{today}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <Select
              value={selectedOffice}
              onValueChange={setSelectedOffice}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 text-gray-700">
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
      </div>

      {/* Main Content */}
      <div className="pb-6">
        {isMobile ? (
          <MobileDashboard
            teamMembers={mockData.teamMembers}
            activeProjects={mockData.activeProjects}
            activeResources={mockData.activeResources}
            utilizationTrends={mockData.utilizationRate}
            staffData={mockData.staffData}
          />
        ) : (
          <div className="p-4">
            <DesktopDashboard
              teamMembers={mockData.teamMembers}
              activeProjects={mockData.activeProjects}
              activeResources={mockData.activeResources}
              utilizationTrends={mockData.utilizationRate}
              staffData={mockData.staffData}
              mockData={mockData}
            />
          </div>
        )}
      </div>
    </div>
  );
};
