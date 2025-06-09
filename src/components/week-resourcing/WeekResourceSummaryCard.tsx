
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

interface WeekResourceSummaryCardProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const WeekResourceSummaryCard: React.FC<WeekResourceSummaryCardProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Calculate total allocated hours for the week
  const totalAllocatedHours = allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
  
  // Calculate total team capacity
  const totalCapacity = members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
  
  // Calculate utilization percentage
  const utilization = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
  
  // Count active projects (projects with allocations)
  const activeProjects = projects.filter(project => 
    allocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0)
  ).length;
  
  // Calculate available capacity
  const availableHours = Math.max(0, totalCapacity - totalAllocatedHours);
  
  // Get utilization status
  const getUtilizationStatus = (percentage: number) => {
    if (percentage < 60) return { text: 'Low', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage <= 85) return { text: 'Optimal', color: 'bg-green-100 text-green-800' };
    if (percentage <= 100) return { text: 'High', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Over-allocated', color: 'bg-red-100 text-red-800' };
  };
  
  const utilizationStatus = getUtilizationStatus(utilization);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Week Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Team Utilization */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Utilization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{utilization}%</span>
              <Badge className={`text-xs ${utilizationStatus.color}`}>
                {utilizationStatus.text}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">{totalAllocatedHours}h of {totalCapacity}h</p>
          </div>

          {/* Active Projects */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Active Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{activeProjects}</span>
              <span className="text-sm text-gray-500">of {projects.length}</span>
            </div>
            <p className="text-xs text-gray-500">Projects with allocations</p>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{members.length}</span>
            </div>
            <p className="text-xs text-gray-500">Total capacity: {totalCapacity}h</p>
          </div>

          {/* Available Hours */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{availableHours}h</span>
            </div>
            <p className="text-xs text-gray-500">Remaining capacity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
