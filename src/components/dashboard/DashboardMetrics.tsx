
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
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

// Mock data
const mockData = {
  activeResources: 96,
  activeProjects: 55,
  utilizationRate: {
    days7: 85,
    days30: 78,
    days90: 82
  },
  staffData: [
    { name: 'Carmen Simone', role: 'Developer', availability: 95 },
    { name: 'Akshaya Patel', role: 'Designer', availability: 72 },
    { name: 'Jo Wang', role: 'PM', availability: 65 },
    { name: 'Julia Ile', role: 'Developer', availability: 88 },
    { name: 'Kay Sasiprapakul', role: 'Developer', availability: 30 },
    { name: 'Kosmas Silelogiou', role: 'Developer', availability: 45 },
    { name: 'Lee Han-Tse', role: 'Designer', availability: 60 },
    { name: 'Mandy Wan', role: 'PM', availability: 75 },
  ],
  projectsByStatus: [
    { name: 'In Progress', value: 17 },
    { name: 'Complete', value: 2 },
    { name: 'On Hold', value: 2 },
  ],
  projectsByStage: [
    { name: 'Analysis', value: 6 },
    { name: 'Design', value: 8 },
    { name: 'Development', value: 14 },
    { name: 'Testing', value: 3 },
  ],
  projectsByRegion: [
    { name: 'Saudi Arabia', value: 17 },
    { name: 'London', value: 1 },
    { name: 'Italy', value: 2 },
    { name: 'Oman', value: 1 },
  ],
  resourcesByOffice: [
    { name: 'London', value: 22 },
    { name: 'Dubai', value: 10 },
    { name: 'Hong Kong', value: 3 },
    { name: 'New York', value: 5 },
  ],
  upcomingHolidays: [
    { date: '2025-05-27', name: 'Memorial Day', offices: ['London'] },
    { date: '2025-06-15', name: 'Eid al-Adha', offices: ['Dubai', 'Riyadh'] },
    { date: '2025-07-04', name: 'Independence Day', offices: ['New York'] },
    { date: '2025-08-12', name: 'Queen\'s Birthday', offices: ['London'] },
    { date: '2025-08-15', name: 'Indian Independence Day', offices: ['Mumbai'] },
    { date: '2025-09-01', name: 'Labour Day', offices: ['New York'] },
    { date: '2025-10-01', name: 'National Day', offices: ['Hong Kong', 'Beijing'] },
  ],
  offices: ['All Offices', 'London', 'Dubai', 'Hong Kong', 'New York', 'Mumbai', 'Riyadh', 'Beijing'],
};

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  // Get today's date in the format "Monday, May 1, 2025"
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">{today}</p>
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

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Section A: Left column with Date + KPIs */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Active Resources</h3>
                  <p className="text-5xl font-bold text-gray-900">{mockData.activeResources}</p>
                  <p className="text-sm text-gray-500 mt-1">Currently active team members</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Live Projects</h3>
                  <p className="text-5xl font-bold text-gray-900">{mockData.activeProjects}</p>
                  <p className="text-sm text-gray-500 mt-1">Active projects in progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section B: Center column with utilization gauges */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Resource Utilization</h3>
              <div className="flex justify-between items-center">
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days7} 
                    max={100} 
                    title="7 Days"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days30} 
                    max={100} 
                    title="30 Days"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days90} 
                    max={100} 
                    title="90 Days"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section C: Right column with HERBIE chat */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6 h-full">
              <HerbieChat />
            </CardContent>
          </Card>
        </div>

        {/* Section D: Holidays list */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <HolidaysList holidays={mockData.upcomingHolidays} />
            </CardContent>
          </Card>
        </div>

        {/* Section E: Staff Availability */}
        <div className="col-span-12 lg:col-span-9">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <StaffAvailability staffMembers={mockData.staffData} />
            </CardContent>
          </Card>
        </div>

        {/* Section F: Four charts in a row */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <Donut data={mockData.projectsByStatus} title="Projects by Status" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <Donut data={mockData.projectsByStage} title="Projects by Stage" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <Donut data={mockData.projectsByRegion} title="Projects by Region" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <Donut data={mockData.resourcesByOffice} title="Resources by Office" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
