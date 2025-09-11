import { useMemo } from 'react';
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
  const rundownItems = useMemo(() => {
    if (rundownMode === 'people') {
      // Process people data
      let processedPeople = allMembers.map(member => {
        const memberTotal = getMemberTotal(member.id);
        const capacity = member.weekly_capacity || 40;
        const totalHours = memberTotal?.resourcedHours || 0;
        const utilizationPercentage = capacity > 0 ? (totalHours / capacity) * 100 : 0;

        // Process project allocations
        const projectAllocations = memberTotal?.projectAllocations || [];
        const projects = projectAllocations.map(allocation => ({
          projectId: allocation.projectId,
          projectName: allocation.projectName,
          projectCode: allocation.projectCode,
          hours: allocation.hours,
          percentage: totalHours > 0 ? (allocation.hours / totalHours) * 100 : 0,
          color: allocation.color
        }));

        return {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          name: `${member.first_name} ${member.last_name}`,
          location: member.location || 'Unknown',
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

      // Sort people based on sortOption
      processedPeople.sort((a, b) => {
        switch (sortOption) {
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'utilization':
            return b.utilization - a.utilization;
          case 'location':
            return a.location.localeCompare(b.location);
          default:
            return 0;
        }
      });

      return processedPeople;
    } else {
      // Process projects data
      let processedProjects = projects.map(project => {
        // Get all team members working on this project
        const teamMembers = allMembers
          .map(member => {
            const memberTotal = getMemberTotal(member.id);
            const projectAllocations = memberTotal?.projectAllocations || [];
            const projectAllocation = projectAllocations.find(p => p.projectId === project.id);
            
            if (projectAllocation && projectAllocation.hours > 0) {
              const capacity = member.weekly_capacity || 40;
              const capacityPercentage = capacity > 0 ? (projectAllocation.hours / capacity) * 100 : 0;
              
              return {
                id: member.id,
                name: `${member.first_name} ${member.last_name}`,
                avatar: member.avatar_url,
                location: member.location || 'Unknown',
                hours: projectAllocation.hours,
                capacityPercentage
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
          teamMembers
        };
      })
      .filter(project => project.totalHours > 0); // Only show projects with allocations

      // Sort projects based on sortOption
      processedProjects.sort((a, b) => {
        switch (sortOption) {
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'utilization':
            return b.totalHours - a.totalHours;
          case 'location':
            return (a.office || '').localeCompare(b.office || '');
          default:
            return 0;
        }
      });

      return processedProjects;
    }
  }, [allMembers, projects, rundownMode, sortOption, getMemberTotal, getProjectCount]);

  return { rundownItems };
};