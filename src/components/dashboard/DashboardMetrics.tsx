import React, { useState } from 'react';
import {
  Building,
  Users,
  Target,
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
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

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

const COLORS = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2'];
const periods = ['7 Days', '30 Days', '90 Days'] as const;
type Period = typeof periods[number];

export const DashboardMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7 Days');
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
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Resources</CardTitle>
            <Building className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{filteredMockData.teamSize}</div>
            <p className="text-sm text-gray-600 mt-1">Active team members</p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Live Projects</CardTitle>
            <Target className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockData.liveProjects}</div>
            <p className="text-sm text-gray-600 mt-1">Current active projects</p>
          </CardContent>
        </Card>

        <Card className="col-span-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">Resource Utilization Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between gap-4">
            {periods.map((period) => (
              <div key={period} className="text-center">
                <div className="mb-2 text-sm text-gray-600">{period}</div>
                <div className="relative h-24 w-24">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-100"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-blue-500"
                      strokeWidth="8"
                      strokeDasharray={`${mockData.utilizationRate[period === '7 Days' ? 'week' : period === '30 Days' ? 'month' : 'quarter'] * 2.51327} 251.327`}
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
                    <span className="text-xl font-bold text-gray-900">
                      {mockData.utilizationRate[period === '7 Days' ? 'week' : period === '30 Days' ? 'month' : 'quarter']}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">Staff Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Staff ({mockData.staffData.available.length})</TabsTrigger>
                <TabsTrigger value="overloaded">Overloaded Staff ({mockData.staffData.overloaded.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="available" className="h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {mockData.staffData.available.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                      <Users className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="overloaded" className="h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {mockData.staffData.overloaded.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                      <Users className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {mockData.upcomingHolidays.map((holiday) => (
                <div key={holiday.date} className="py-3">
                  <div className="flex justify-between text-gray-800">
                    <span>{holiday.name}</span>
                    <span>{new Date(holiday.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">{holiday.office}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.projectsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {mockData.projectsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">Projects by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.projectsByRegion}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {mockData.projectsByRegion.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">Resources by Office</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.resourcesByOffice}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {mockData.resourcesByOffice.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
