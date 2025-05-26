
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle, DollarSign, Briefcase } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { Donut } from './Donut';
import { HolidayCard } from './HolidayCard';
import { StaffAvailability } from './StaffAvailability';
import { Badge } from "@/components/ui/badge";

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
  const getUtilizationStatus = (rate: number) => {
    if (rate > 90) return { color: 'destructive', label: 'Overutilized' };
    if (rate > 80) return { color: 'default', label: 'High Utilization' };
    if (rate > 60) return { color: 'secondary', label: 'Healthy' };
    return { color: 'outline', label: 'Underutilized' };
  };

  const utilizationStatus = getUtilizationStatus(utilizationTrends.days7);

  return (
    <div className="space-y-8 p-6">
      {/* CEO Priority 1: Executive Summary */}
      <div className="bg-gradient-to-br from-brand-violet/5 to-blue-50/50 rounded-2xl p-6 border border-brand-violet/10">
        <h2 className="text-2xl font-bold text-brand-violet mb-6 flex items-center gap-3">
          <DollarSign className="h-6 w-6" />
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Utilization</p>
                  <p className="text-3xl font-bold text-brand-violet mt-1">{utilizationTrends.days7}%</p>
                  <Badge variant={utilizationStatus.color as any} className="mt-2 text-xs">
                    {utilizationStatus.label}
                  </Badge>
                </div>
                <div className="h-12 w-12 rounded-full bg-brand-violet/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-brand-violet" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Capacity</p>
                  <p className="text-3xl font-bold text-brand-violet mt-1">2,340h</p>
                  <p className="text-xs text-gray-500 mt-1">Next 12 weeks</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-brand-violet mt-1">{activeProjects}</p>
                  <p className="text-xs text-gray-500 mt-1">{(activeProjects / activeResources).toFixed(1)} per person</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Size</p>
                  <p className="text-3xl font-bold text-brand-violet mt-1">{activeResources}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {utilizationTrends.days7 > 85 ? 'Consider Hiring' : 'Stable'}
                  </Badge>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CEO Priority 2: Strategic Insights & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EnhancedInsights 
            teamMembers={teamMembers}
            activeProjects={activeProjects}
            utilizationRate={utilizationTrends.days7}
            utilizationTrends={utilizationTrends}
            staffMembers={staffData}
          />
        </div>

        <HolidayCard holidays={mockData.upcomingHolidays} />
      </div>

      {/* CEO Priority 3: Analytics & Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStatus} 
              title="Project Status" 
              colors={['#6F4BF6', '#FFB443', '#91D3FF']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStage} 
              title="Project Stages"
              colors={['#6F4BF6', '#FFB443', '#91D3FF']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByRegion} 
              title="Regional Split"
              colors={['#6F4BF6', '#91D3FF', '#FFB443']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectInvoicesThisMonth} 
              title="Project Invoices This Month"
              colors={['#22C55E', '#F59E0B', '#EF4444']}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* CEO Priority 4: Planning & Team Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResourcePlanningChat 
          teamSize={teamMembers.length}
          activeProjects={activeProjects}
          utilizationRate={utilizationTrends.days7}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <StaffAvailability staffMembers={staffData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
