
import React, { useState } from 'react';
import {
  Users,
  Activity,
  Gauge,
  User,
  UserX,
  FileBarChart,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data - replace with real data from your API
const mockData = {
  teamSize: 24,
  liveProjects: 12,
  utilizationRate: 78,
  availableStaff: 8,
  overloadedStaff: 3,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Key Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.teamSize}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Projects</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.liveProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Utilization Rate
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
          </CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.utilizationRate}%</div>
        </CardContent>
      </Card>

      {/* Staff Availability */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Staff</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.availableStaff}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overloaded Staff</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.overloadedStaff}</div>
        </CardContent>
      </Card>

      {/* Projects by Status */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects by Status</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.projectsByStatus}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projects by Region */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects by Region</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
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
                outerRadius={80}
              >
                {mockData.projectsByRegion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Upcoming Holidays */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Holidays</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockData.upcomingHolidays.map((holiday) => (
              <div key={holiday.date} className="flex justify-between items-center">
                <span className="text-sm font-medium">{holiday.name}</span>
                <span className="text-sm text-muted-foreground">{holiday.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources by Office */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resources by Office</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.resourcesByOffice} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
