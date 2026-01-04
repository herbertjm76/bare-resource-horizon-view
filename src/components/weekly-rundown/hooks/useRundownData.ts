import { useMemo } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { RundownMode, SortOption } from '../WeeklyRundownView';

interface UseRundownDataProps {
  allMembers: any[];
  projects: any[];
  rundownMode: RundownMode;
  sortOption: SortOption;
  getMemberTotal: (memberId: string) => any;
  getProjectCount: (memberId: string) => number;
}

export const useRundownData = ({
  allMembers,
  projects,
  rundownMode,
  sortOption,
  getMemberTotal,
  getProjectCount
}: UseRundownDataProps) => {
  const { workWeekHours } = useAppSettings();

  // Memoize the rundown items to prevent flickering
  // Note: allMembers is already sorted by the parent hook (useStreamlinedWeekResourceData)
  const rundownItems = useMemo(() => {
    
    
    // Early return if no data
    if (!allMembers || allMembers.length === 0) {
      return [];
    }
    
    if (rundownMode === 'people') {
      // Process people data - preserve the sort order from allMembers (already sorted)
      const processedPeople = allMembers.map(member => {
        const memberTotal = getMemberTotal(member.id);
        const capacity = member.weekly_capacity || workWeekHours;

        const projectAllocations = memberTotal?.projectAllocations || [];
        const totalProjectHours = projectAllocations.reduce(
          (sum: number, a: any) => sum + (a?.hours || 0),
          0
        );

        // Some data sources don't populate `resourcedHours` consistently.
        // Prefer resourcedHours when present, otherwise derive it from project allocations.
        const baseResourcedHours =
          typeof memberTotal?.resourcedHours === 'number' ? memberTotal.resourcedHours : totalProjectHours;

        const totalLeaveHours =
          (memberTotal?.annualLeave || 0) +
          (memberTotal?.vacationLeave || 0) +
          (memberTotal?.medicalLeave || 0) +
          (memberTotal?.publicHoliday || 0);

        const totalHours = baseResourcedHours;
        const utilizationPercentage = capacity > 0 ? ((totalHours + totalLeaveHours) / capacity) * 100 : 0;

        // Process project allocations
        const projects = projectAllocations.map((allocation: any) => ({
          id: allocation.projectId,
          name: allocation.projectName,
          code: allocation.projectCode,
          hours: allocation.hours,
          percentage: capacity > 0 ? (allocation.hours / capacity) * 100 : 0,
          color: allocation.color,
          allocationId: allocation.allocationId // Include the allocation ID for edit/delete
        }));

        return {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          name: `${member.first_name} ${member.last_name}`,
          location: member.location || 'Unknown',
          department: member.department || 'Unknown',
          avatar_url: member.avatar_url,
          avatar: member.avatar_url,
          totalHours,
          resourcedHours: totalHours,
          capacity,
          utilizationPercentage,
          utilization: utilizationPercentage,
          projects,
          leave: {
            annualLeave: memberTotal?.annualLeave || 0,
            vacationLeave: memberTotal?.vacationLeave || 0,
            medicalLeave: memberTotal?.medicalLeave || 0,
            publicHoliday: memberTotal?.publicHoliday || 0
          },
          annualLeave: memberTotal?.annualLeave || 0,
          vacationLeave: memberTotal?.vacationLeave || 0,
          medicalLeave: memberTotal?.medicalLeave || 0,
          publicHoliday: memberTotal?.publicHoliday || 0
        };
      });

      // No sorting needed - allMembers is already sorted by useStreamlinedWeekResourceData
      return processedPeople;
    } else {
      // Process projects data - show ALL projects even without allocations
      // First, build a map of all project allocations per member
      const memberProjectsMap = new Map<string, Array<{ id: string; name: string; code: string; hours: number }>>();
      
      allMembers.forEach(member => {
        const memberTotal = getMemberTotal(member.id);
        const projectAllocations = memberTotal?.projectAllocations || [];
        const memberProjects = projectAllocations
          .filter(p => p.hours > 0)
          .map(p => ({
            id: p.projectId,
            name: p.projectName,
            code: p.projectCode,
            hours: p.hours
          }));
        memberProjectsMap.set(member.id, memberProjects);
      });

      let processedProjects = projects.map(project => {
        // Get all team members working on this project
        const teamMembers = allMembers
          .map(member => {
            const memberTotal = getMemberTotal(member.id);
            const projectAllocations = memberTotal?.projectAllocations || [];
            const projectAllocation = projectAllocations.find(p => p.projectId === project.id);
            
            if (projectAllocation && projectAllocation.hours > 0) {
              const capacity = member.weekly_capacity || workWeekHours;
              const capacityPercentage = capacity > 0 ? (projectAllocation.hours / capacity) * 100 : 0;
              
              // Get all projects for this member
              const allProjects = memberProjectsMap.get(member.id) || [];
              const totalHours = allProjects.reduce((sum, p) => sum + p.hours, 0);
              
              return {
                id: member.id,
                name: `${member.first_name} ${member.last_name}`,
                avatar: member.avatar_url,
                location: member.location || 'Unknown',
                hours: projectAllocation.hours,
                capacityPercentage,
                allProjects,
                totalHours
              };
            }
            return null;
          })
          .filter(Boolean);

        const totalHours = teamMembers.reduce((sum, member) => sum + member.hours, 0);

        return {
          id: project.id,
          name: project.name,
          code: project.code,
          color: project.color,
          totalHours,
          status: project.status,
          office: project.office?.name,
          department: project.department,
          teamMembers
        };
      }); // Show ALL projects, not just those with allocations

      // Sort projects based on sortOption
      processedProjects.sort((a, b) => {
        switch (sortOption) {
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'utilization':
            return b.totalHours - a.totalHours;
          case 'location':
            return (a.office || '').localeCompare(b.office || '');
          case 'department':
            return (a.department || '').localeCompare(b.department || '');
          default:
            return 0;
        }
      });

      return processedProjects;
    }
  }, [allMembers, projects, rundownMode, sortOption, getMemberTotal, getProjectCount, workWeekHours]);

  return { rundownItems };
};