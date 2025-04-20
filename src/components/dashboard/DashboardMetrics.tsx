import React, { useState } from 'react';
import {
  Gauge,
  Square,
  SquareUser,
  Filter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

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
  const [selectedOffice, setSelectedOffice] = useState('all');

  const filteredMockData = {
    ...mockData,
    teamSize: selectedOffice === 'all' ? mockData.teamSize : 
      mockData.resourcesByOffice.find(o => o.name.toLowerCase() === selectedOffice)?.value || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/80" />
          <Select
            value={selectedOffice}
            onValueChange={setSelectedOffice}
          >
            <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/20 text-white">
              <SelectValue placeholder="Select office" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              {mockData.resourcesByOffice.map((office) => (
                <SelectItem key={office.name} value={office.name.toLowerCase()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-1 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Team Size</CardTitle>
            <Square className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredMockData.teamSize}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Live Projects</CardTitle>
            <Square className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockData.liveProjects}</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Utilization Rates</CardTitle>
            <Gauge className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {periods.map((period) => (
              <div key={period} className="relative">
                <div className="text-center mb-2">
                  <span className="text-sm text-white/80">{period}</span>
                </div>
                <div className="relative h-24 w-24 mx-auto">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-white/20"
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
                    <span className="text-xl font-bold text-white">{mockData.utilizationRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Staff Status</CardTitle>
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
                  <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg bg-white/5">
                    <SquareUser className="h-5 w-5 text-white" />
                    <div>
                      <p className="font-medium text-white">{staff.name}</p>
                      <p className="text-sm text-white/70">{staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="overloaded">
              <div className="space-y-4">
                {mockData.staffData.overloaded.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg bg-white/5">
                    <SquareUser className="h-5 w-5 text-white" />
                    <div>
                      <p className="font-medium text-white">{staff.name}</p>
                      <p className="text-sm text-white/70">{staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Projects by Status</CardTitle>
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

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Projects by Region</CardTitle>
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

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Resources by Office</CardTitle>
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
