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
    // Create realistic mock allocation data for this week
    const mockProjects = [
      { id: '1', name: 'E-commerce Platform Redesign', code: 'ECP-2024', color: '#3B82F6' },
      { id: '2', name: 'Mobile App Development', code: 'MAD-2024', color: '#10B981' },
      { id: '3', name: 'Data Analytics Dashboard', code: 'DAD-2024', color: '#F59E0B' },
      { id: '4', name: 'Customer Portal', code: 'CP-2024', color: '#8B5CF6' },
      { id: '5', name: 'Marketing Website', code: 'MW-2024', color: '#EF4444' },
      { id: '6', name: 'Internal Tools', code: 'IT-2024', color: '#06B6D4' }
    ];

    // Mock realistic allocations ensuring no one exceeds 50 hours
    const mockAllocations = {
      'member-1': [
        { projectId: '1', projectName: 'E-commerce Platform Redesign', projectCode: 'ECP-2024', hours: 25, color: '#3B82F6' },
        { projectId: '3', projectName: 'Data Analytics Dashboard', projectCode: 'DAD-2024', hours: 15, color: '#F59E0B' }
      ],
      'member-2': [
        { projectId: '2', projectName: 'Mobile App Development', projectCode: 'MAD-2024', hours: 32, color: '#10B981' },
        { projectId: '4', projectName: 'Customer Portal', projectCode: 'CP-2024', hours: 8, color: '#8B5CF6' }
      ],
      'member-3': [
        { projectId: '1', projectName: 'E-commerce Platform Redesign', projectCode: 'ECP-2024', hours: 20, color: '#3B82F6' },
        { projectId: '5', projectName: 'Marketing Website', projectCode: 'MW-2024', hours: 20, color: '#EF4444' }
      ],
      'member-4': [
        { projectId: '2', projectName: 'Mobile App Development', projectCode: 'MAD-2024', hours: 35, color: '#10B981' },
        { projectId: '6', projectName: 'Internal Tools', projectCode: 'IT-2024', hours: 5, color: '#06B6D4' }
      ],
      'member-5': [
        { projectId: '3', projectName: 'Data Analytics Dashboard', projectCode: 'DAD-2024', hours: 30, color: '#F59E0B' },
        { projectId: '4', projectName: 'Customer Portal', projectCode: 'CP-2024', hours: 10, color: '#8B5CF6' }
      ]
    };

    if (rundownMode === 'people') {
      // Process people data with mock allocations
      let processedPeople = allMembers.map((member, index) => {
        const capacity = member.weekly_capacity || 40;
        const memberId = `member-${index + 1}`;
        const allocations = mockAllocations[memberId] || [];
        
        const totalHours = allocations.reduce((sum, alloc) => sum + alloc.hours, 0);
        const utilizationPercentage = capacity > 0 ? (totalHours / capacity) * 100 : 0;

        // Process project allocations
        const projects = allocations.map(allocation => ({
          id: allocation.projectId,
          name: allocation.projectName,
          code: allocation.projectCode,
          hours: allocation.hours,
          percentage: totalHours > 0 ? (allocation.hours / totalHours) * 100 : 0,
          color: allocation.color
        }));

        // Mock some leave data
        const hasLeave = Math.random() > 0.7; // 30% chance of having leave
        const leave = hasLeave ? {
          annualLeave: Math.random() > 0.5 ? 8 : 0,
          vacationLeave: 0,
          medicalLeave: 0,
          publicHoliday: Math.random() > 0.8 ? 8 : 0
        } : {
          annualLeave: 0,
          vacationLeave: 0,
          medicalLeave: 0,
          publicHoliday: 0
        };

        return {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          location: member.location || 'Remote',
          avatar_url: member.avatar_url,
          totalHours,
          capacity,
          utilizationPercentage,
          projects,
          leave
        };
      });

      // Sort people based on sortOption
      processedPeople.sort((a, b) => {
        switch (sortOption) {
          case 'alphabetical':
            return (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name);
          case 'utilization':
            return b.utilizationPercentage - a.utilizationPercentage;
          case 'location':
            return a.location.localeCompare(b.location);
          default:
            return 0;
        }
      });

      return processedPeople;
    } else {
      // Process projects data with mock allocations
      let processedProjects = mockProjects.map(project => {
        // Get all team members working on this project
        const teamMembers = allMembers
          .map((member, index) => {
            const memberId = `member-${index + 1}`;
            const allocations = mockAllocations[memberId] || [];
            const projectAllocation = allocations.find(p => p.projectId === project.id);
            
            if (projectAllocation && projectAllocation.hours > 0) {
              const capacity = member.weekly_capacity || 40;
              const capacityPercentage = capacity > 0 ? (projectAllocation.hours / capacity) * 100 : 0;
              
              return {
                id: member.id,
                first_name: member.first_name,
                last_name: member.last_name,
                avatar_url: member.avatar_url,
                location: member.location || 'Remote',
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
          status: 'Active',
          office: allMembers[0]?.office?.name || 'Multi-Office',
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