import React, { useState } from 'react';
import {
  Building,
  Users,
  Target,
  Filter,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from './metrics/MetricCard';
import { UtilizationMetric } from './metrics/UtilizationMetric';
import { ChartMetric } from './metrics/ChartMetric';

const mockData = {
  teamSize: 47,
  liveProjects: 17,
  utilizationRate: {
    week: 85,
    month: 78,
    quarter: 82
  },
  staffData: {
    available: [
      { id: 1, name: 'Carmen Simone', role: 'Developer' },
      { id: 2, name: 'Akshaya', role: 'Designer' },
      { id: 3, name: 'Jo Wang', role: 'PM' },
      { id: 4, name: 'Julia Ile', role: 'Developer' },
      { id: 5, name: 'Kay Sasiprapakul', role: 'Developer' },
    ],
    overloaded: [
      { id: 6, name: 'Kosmas Silelogiou', role: 'Developer' },
      { id: 7, name: 'Lee Han-Tse', role: 'Designer' },
      { id: 8, name: 'Mandy Wan', role: 'PM' },
    ]
  },
  projectsByStatus: [
    { name: 'In Progress', value: 17 },
    { name: 'Complete', value: 2 },
    { name: 'On Hold', value: 2 },
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
  ],
  upcomingHolidays: [
    { date: '2025-05-27', name: 'Memorial Day', office: 'London' },
    { date: '2025-07-04', name: 'Independence Day', office: 'Dubai' },
  ],
};

const periods = ['7 Days', '30 Days', '90 Days'] as const;

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('all');

  const filteredMockData = {
    ...mockData,
    teamSize: selectedOffice === 'all' ? mockData.teamSize : 
      mockData.resourcesByOffice.find(o => o.name.toLowerCase() === selectedOffice)?.value || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <Select
            value={selectedOffice}
            onValueChange={setSelectedOffice}
          >
            <SelectTrigger className="w-[180px] bg-white border border-gray-300 text-gray-700">
              <SelectValue placeholder="All Office" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Office</SelectItem>
              {mockData.resourcesByOffice.map((office) => (
                <SelectItem key={office.name} value={office.name.toLowerCase()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <MetricCard
            title="Total Resources"
            value={filteredMockData.teamSize}
            description="Active team members"
            icon={Building}
          />
        </div>
        <div className="col-span-3">
          <MetricCard
            title="Live Projects"
            value={mockData.liveProjects}
            description="Current active projects"
            icon={Target}
          />
        </div>
        <UtilizationMetric
          periods={periods}
          utilizationRate={mockData.utilizationRate}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <ChartMetric
          title="Projects by Status"
          data={mockData.projectsByStatus}
        />
        <ChartMetric
          title="Projects by Region"
          data={mockData.projectsByRegion}
        />
        <ChartMetric
          title="Resources by Office"
          data={mockData.resourcesByOffice}
        />
      </div>
    </div>
  );
};
