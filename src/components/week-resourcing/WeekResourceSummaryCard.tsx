
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';

interface WeekResourceSummaryCardProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
  selectedWeek: Date;
}

export const WeekResourceSummaryCard: React.FC<WeekResourceSummaryCardProps> = ({
  projects,
  members,
  allocations,
  weekStartDate,
  selectedWeek
}) => {
  // Use standardized utilization data
  const {
    teamSummary,
    isLoading
  } = useStandardizedUtilizationData({
    selectedWeek,
    teamMembers: members || []
  });

  // Fallback to local calculations if standardized data is loading
  const totalAllocatedHours = teamSummary?.totalAllocatedHours || 
    allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
  
  const totalCapacity = teamSummary?.totalCapacity || 
    members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
  
  const utilizationRate = teamSummary?.teamUtilizationRate || 
    (totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0);
  
  const availableHours = teamSummary?.totalAvailableHours || 
    Math.max(0, totalCapacity - totalAllocatedHours);
  
  // Count active projects (projects with allocations)
  const activeProjects = projects.filter(project => 
    allocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0)
  ).length;
  
  // Get standardized colors and badge text
  const utilizationColor = UtilizationCalculationService.getUtilizationColor(utilizationRate);
  const utilizationBadgeText = UtilizationCalculationService.getUtilizationBadgeText(utilizationRate);
  const availableHoursColor = UtilizationCalculationService.getAvailableHoursColor(availableHours);
  const availableHoursBadgeText = UtilizationCalculationService.getAvailableHoursBadgeText(availableHours);

  // Map colors to exact badge styles
  const getBadgeClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'orange':
        return 'bg-orange-500 text-white';
      case 'red':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const metrics = [
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      icon: TrendingUp,
      subtitle: `${totalAllocatedHours}h of ${totalCapacity}h`,
      badgeText: utilizationBadgeText,
      badgeColor: utilizationColor
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Calendar,
      subtitle: `${projects.length} total projects`,
      badgeText: activeProjects > 0 ? 'Active' : 'None',
      badgeColor: activeProjects > 0 ? 'green' : 'red'
    },
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      subtitle: `Total capacity: ${totalCapacity}h`,
      badgeText: members.length > 0 ? 'Active' : 'None',
      badgeColor: members.length > 0 ? 'green' : 'red'
    },
    {
      title: "Available Hours",
      value: `${availableHours}h`,
      icon: Clock,
      subtitle: "Remaining capacity",
      badgeText: availableHoursBadgeText,
      badgeColor: availableHoursColor
    }
  ];

  return (
    <div className="w-full bg-gray-50 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <Card key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-brand-violet/10">
                    <IconComponent className="h-5 w-5 text-brand-violet" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  {metric.badgeText && (
                    <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeClasses(metric.badgeColor)}`}>
                      {metric.badgeText}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
