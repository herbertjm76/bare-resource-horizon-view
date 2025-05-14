import React, { useState } from 'react';
import { Filter, Activity, Users } from 'lucide-react';
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
};

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

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

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-4 flex items-center">
              <div className="space-y-4 flex-grow">
                <div>
                  <p className="text-4xl font-bold text-brand-violet">{mockData.activeResources}</p>
                  <p className="text-base">Active members</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-brand-violet">{mockData.activeProjects}</p>
                  <p className="text-base">Live projects</p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 ml-4 opacity-30">
                <Users 
                  size={48} 
                  strokeWidth={1.5} 
                  className="text-brand-violet/30" 
                />
                <Activity 
                  size={48} 
                  strokeWidth={1.5} 
                  className="text-brand-violet/30" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Resource Utilization Trends</h3>
              <div className="flex justify-between items-center">
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days7} 
                    max={100} 
                    title="7 Days"
                    size="lg"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days30} 
                    max={100} 
                    title="30 Days"
                    size="lg"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Gauge 
                    value={mockData.utilizationRate.days90} 
                    max={100} 
                    title="90 Days"
                    size="lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl h-full">
            <CardContent className="p-6 h-full">
              <HerbieChat />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-6">
              <HolidaysList holidays={mockData.upcomingHolidays} />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-9">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-6">
              <StaffAvailability staffMembers={mockData.staffData} />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="shadow-xs border border-[#F0F0F4] rounded-2xl">
            <CardContent className="p-6">
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
            <CardContent className="p-6">
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
            <CardContent className="p-6">
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
            <CardContent className="p-6">
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
