
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Calendar, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { formatAllocationValue, formatUtilizationSummary } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface TeamMemberProjectOverviewProps {
  memberId: string;
}

interface ProjectAllocation {
  project: {
    id: string;
    name: string;
    code: string;
    status: string;
  };
  totalHours: number;
  weeklyBreakdown: { weekStart: string; hours: number }[];
}

export const TeamMemberProjectOverview: React.FC<TeamMemberProjectOverviewProps> = ({ memberId }) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { projectDisplayPreference, displayPreference, workWeekHours } = useAppSettings();

  useEffect(() => {
    const fetchProjectAllocations = async () => {
      if (!company?.id || !memberId) return;

      setIsLoading(true);
      try {
        // Get the current week and next 12 weeks
        const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endWeek = addWeeks(currentWeek, 12);

        // FIX: Fetch all allocations to prevent inconsistent data, then filter in frontend
        // RULEBOOK: ALL allocation reads include both active and pre_registered
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            hours,
            allocation_date,
            project:projects(id, name, code, status)
          `)
          .eq('company_id', company.id)
          .eq('resource_id', memberId)
          .in('resource_type', ['active', 'pre_registered'])
          .order('allocation_date', { ascending: true });

        if (error) throw error;

        // Filter to current + next 8 weeks in frontend for consistency
        const filteredAllocations = allocations?.filter(allocation => {
          const allocationDate = new Date(allocation.allocation_date);
          return allocationDate >= currentWeek && allocationDate <= endWeek;
        }) || [];

        logger.debug('Team member project overview fetched', {
          totalRecords: allocations?.length || 0,
          filteredRecords: filteredAllocations.length,
          memberId
        });

        // Group by project using filtered allocations
        const projectMap = new Map<string, ProjectAllocation>();
        
        filteredAllocations?.forEach(allocation => {
          if (!allocation.project) return;
          
          const projectId = allocation.project.id;
          if (!projectMap.has(projectId)) {
            projectMap.set(projectId, {
              project: allocation.project,
              totalHours: 0,
              weeklyBreakdown: []
            });
          }
          
          const projectAllocation = projectMap.get(projectId)!;
          projectAllocation.totalHours += allocation.hours;
          projectAllocation.weeklyBreakdown.push({
            weekStart: allocation.allocation_date,
            hours: allocation.hours
          });
        });

        setProjectAllocations(Array.from(projectMap.values()));
      } catch (error) {
        console.error('Error fetching project allocations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAllocations();
  }, [company?.id, memberId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalAllocatedHours = projectAllocations.reduce((sum, project) => sum + project.totalHours, 0);
  const maxCapacity = workWeekHours * 12; // capacity per week for 12 weeks

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Project Allocations</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Project Allocations</h2>
        <div className="text-sm text-gray-600">
          Next 12 weeks: {formatAllocationValue(totalAllocatedHours, maxCapacity, displayPreference)} allocated
        </div>
      </div>

      {/* Overall Allocation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-theme-primary" />
            Allocation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Allocated</span>
            <span className="text-lg font-bold text-foreground">
              {formatUtilizationSummary(totalAllocatedHours, maxCapacity, displayPreference)}
            </span>
          </div>
          <Progress 
            value={(totalAllocatedHours / maxCapacity) * 100} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0h</span>
            <span className="font-medium">
              {Math.round((totalAllocatedHours / maxCapacity) * 100)}% utilized
            </span>
            <span>{maxCapacity}h</span>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div className="grid gap-4">
        {projectAllocations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Project Allocations</h3>
              <p className="text-gray-500">This team member has no upcoming project allocations.</p>
            </CardContent>
          </Card>
        ) : (
          projectAllocations.map((allocation, index) => (
            <Card key={allocation.project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {getProjectDisplayName(allocation.project, projectDisplayPreference)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{getProjectSecondaryText(allocation.project, projectDisplayPreference)}</p>
                  </div>
                  <Badge className={`${getStatusColor(allocation.project.status)} border`}>
                    {allocation.project.status?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Total Allocation</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatAllocationValue(allocation.totalHours, maxCapacity, displayPreference)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Project Progress</span>
                    <span className="font-medium">
                      {Math.round((allocation.totalHours / totalAllocatedHours) * 100)}% of total
                    </span>
                  </div>
                  <Progress 
                    value={(allocation.totalHours / totalAllocatedHours) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Weekly breakdown preview */}
                {allocation.weeklyBreakdown.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Upcoming weeks</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {allocation.weeklyBreakdown.slice(0, 6).map((week, weekIndex) => (
                        <div key={weekIndex} className="text-center">
                          <div className="text-xs text-gray-500">
                            {format(new Date(week.weekStart), 'MM/dd')}
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {formatAllocationValue(week.hours, workWeekHours, displayPreference)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
