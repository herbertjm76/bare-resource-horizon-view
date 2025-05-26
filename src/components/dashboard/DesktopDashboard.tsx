
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

  // Separate staff by availability
  const overloadedStaff = staffData.filter(member => member.availability > 85);
  const availableStaff = staffData.filter(member => member.availability <= 85);

  return (
    <div className="space-y-8 p-6">
      {/* CEO Priority 1: Executive Summary with 45-degree gradient */}
      <div 
        className="rounded-2xl p-6 border border-brand-violet/10"
        style={{
          background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <DollarSign className="h-6 w-6" />
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
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

          <Card className="bg-white/90 backdrop-blur-sm">
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

          <Card className="bg-white/90 backdrop-blur-sm">
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

          <Card className="bg-white/90 backdrop-blur-sm">
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

      {/* CEO Priority 2: Three Column Layout - Smart Insights, Staff Status & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Insights */}
        <div className="lg:col-span-1">
          <EnhancedInsights 
            teamMembers={teamMembers}
            activeProjects={activeProjects}
            utilizationRate={utilizationTrends.days7}
            utilizationTrends={utilizationTrends}
            staffMembers={staffData}
          />
        </div>

        {/* Staff Availability & Overloaded */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-violet" />
                Staff Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overloaded Staff */}
              {overloadedStaff.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <h4 className="font-semibold text-red-700">Overloaded ({overloadedStaff.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {overloadedStaff.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
                        <div className="w-8 h-8 rounded-full bg-red-200 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-800">{member.name}</span>
                            <span className="text-red-600 font-semibold">{member.availability}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-red-100 rounded-full">
                            <div 
                              className="h-1.5 rounded-full bg-red-500"
                              style={{ width: `${Math.min(member.availability, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Staff */}
              {availableStaff.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-green-700">Available ({availableStaff.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {availableStaff.slice(0, 3).map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-800">{member.name}</span>
                            <span className="text-green-600 font-semibold">{member.availability}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-green-100 rounded-full">
                            <div 
                              className="h-1.5 rounded-full bg-green-500"
                              style={{ width: `${member.availability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {availableStaff.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{availableStaff.length - 3} more available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Holidays */}
        <div className="lg:col-span-1">
          <HolidayCard holidays={mockData.upcomingHolidays} />
        </div>
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
