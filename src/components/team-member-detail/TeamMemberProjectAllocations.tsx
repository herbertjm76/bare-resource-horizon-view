import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Clock, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { startOfWeek, addWeeks } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface ProjectAllocation {
  id: string;
  name: string;
  status: string;
  totalHours: number;
  weeklyAverage: number;
}

interface TeamMemberProjectAllocationsProps {
  memberId: string;
  weeklyCapacity: number;
}

export const TeamMemberProjectAllocations: React.FC<TeamMemberProjectAllocationsProps> = ({ 
  memberId, 
  weeklyCapacity 
}) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = weeklyCapacity || workWeekHours;

  useEffect(() => {
    const fetchProjectAllocations = async () => {
      if (!company?.id || !memberId) return;

      setIsLoading(true);
      try {
        const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endWeek = addWeeks(currentWeek, 8); // Next 8 weeks

        // FIX: Fetch all allocations to prevent inconsistent data, then filter in frontend
        // RULEBOOK: ALL allocation reads include both active and pre_registered
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            hours,
            allocation_date,
            project:projects(id, name, status)
          `)
          .eq('company_id', company.id)
          .eq('resource_id', memberId)
          .in('resource_type', ['active', 'pre_registered'])
          .order('allocation_date', { ascending: true});

        if (error) throw error;

        // Filter to current + next 8 weeks in frontend for consistency
        const filteredAllocations = allocations?.filter(allocation => {
          const allocationDate = new Date(allocation.allocation_date);
          return allocationDate >= currentWeek && allocationDate <= endWeek;
        }) || [];

        logger.debug('Team member allocations fetched', {
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
              id: allocation.project.id,
              name: allocation.project.name,
              status: allocation.project.status,
              totalHours: 0,
              weeklyAverage: 0
            });
          }
          
          const project = projectMap.get(projectId)!;
          project.totalHours += allocation.hours;
        });

        // Calculate weekly averages
        const projectList = Array.from(projectMap.values()).map(project => ({
          ...project,
          weeklyAverage: project.totalHours / 8 // 8 weeks
        }));

        setProjectAllocations(projectList.sort((a, b) => b.totalHours - a.totalHours));
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalWeeklyHours = projectAllocations.reduce((sum, p) => sum + p.weeklyAverage, 0);

  if (isLoading) {
    return (
      <div className="space-y-4 h-full">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
          Project Allocations
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
        Project Allocations
      </h2>

      {/* Combined Card content with Weekly Summary and Projects */}
      <div className="bg-gradient-to-br from-theme-primary/5 to-theme-primary/5 border-2 rounded-lg p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
        {/* Weekly Summary Section */}
        <div className="text-center pb-4 border-b border-theme-primary/10 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-theme-primary" />
            <span className="font-medium text-theme-primary">Weekly Summary</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-theme-primary mb-1">
            {totalWeeklyHours.toFixed(1)}h
          </div>
          <p className="text-sm text-gray-600">Average per week</p>
        </div>

        {/* Project List Section with Scrolling */}
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-2">
            {projectAllocations.length === 0 ? (
              <div className="py-6 text-center">
                <FolderOpen className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-1">No Active Projects</h3>
                <p className="text-gray-500 text-sm">No upcoming project allocations found.</p>
              </div>
            ) : (
              projectAllocations.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-white/80 border border-brand-primary/10 hover:bg-white/90 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 
                        className="font-medium text-gray-900 truncate" 
                        title={getProjectTooltip(project)}
                      >
                        {getProjectAbbreviation(project)}
                      </h4>
                      <Badge className={`${getStatusColor(project.status)} text-xs flex-shrink-0`}>
                        {project.status?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatAllocationValue(project.weeklyAverage, capacity, displayPreference)}/week</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-lg font-bold text-foreground">
                      {formatAllocationValue(project.totalHours, capacity, displayPreference)}
                    </div>
                    <div className="text-xs text-gray-500">total</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
