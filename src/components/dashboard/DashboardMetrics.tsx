
import React, { useState } from 'react';
import {
  Gauge,
  Square,
  SquareUser,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

// Mock data - replace with real data from your API
const mockData = {
  teamSize: 24,
  liveProjects: 12,
  utilizationRate: 78,
  staffData: {
    available: [
      { id: 1, name: 'John Smith', role: 'Developer' },
      { id: 2, name: 'Sarah Wilson', role: 'Designer' },
      { id: 3, name: 'Mike Johnson', role: 'PM' },
      { id: 4, name: 'Emma Davis', role: 'Developer' },
    ],
    overloaded: [
      { id: 5, name: 'Alex Turner', role: 'Developer' },
      { id: 6, name: 'Lisa Chen', role: 'Designer' },
      { id: 7, name: 'David Brown', role: 'PM' },
    ]
  },
  projectsByStatus: [
    { name: 'Planning', value: 4 },
    { name: 'In Progress', value: 6 },
    { name: 'Review', value: 2 },
    { name: 'Completed', value: 3 },
  ],
  projectsByRegion: [
    { name: 'North America', value: 5 },
    { name: 'Europe', value: 3 },
    { name: 'Asia', value: 4 },
    { name: 'Other', value: 2 },
  ],
  upcomingHolidays: [
    { date: '2025-05-27', name: 'Memorial Day' },
    { date: '2025-07-04', name: 'Independence Day' },
  ],
  resourcesByOffice: [
    { name: 'New York', value: 8 },
    { name: 'London', value: 6 },
    { name: 'Singapore', value: 5 },
    { name: 'Sydney', value: 5 },
  ],
};

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

const periods = ['Week', 'Month', 'Quarter'] as const;
type Period = typeof periods[number];

export const DashboardMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Week');

  return (
    <div className="space-y-6">
      {/* First Row - Small Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.teamSize}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Projects</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.liveProjects}</div>
          </CardContent>
        </Card>

        {/* Utilization Rate with Gauge */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
              <div className="flex gap-2 mt-2">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedPeriod === period
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-secondary"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeDasharray={`${mockData.utilizationRate * 2.51327} 251.327`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{mockData.utilizationRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Staff List with Tabs */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Staff Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Staff ({mockData.staffData.available.length})</TabsTrigger>
              <TabsTrigger value="overloaded">Overloaded Staff ({mockData.staffData.overloaded.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="available">
              <div className="space-y-4">
                {mockData.staffData.available.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg bg-secondary/50">
                    <SquareUser className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="overloaded">
              <div className="space-y-4">
                {mockData.staffData.overloaded.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg bg-secondary/50">
                    <SquareUser className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Third Row - Project Statistics with Donut Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.projectsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {mockData.projectsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projects by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projects by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.projectsByRegion}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {mockData.projectsByRegion.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resources by Office */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resources by Office</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.resourcesByOffice}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {mockData.resourcesByOffice.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
