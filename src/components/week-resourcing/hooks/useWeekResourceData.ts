
import { format, startOfWeek } from 'date-fns';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useWeekResourceAllocations } from './useWeekResourceAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';

interface UseWeekResourceDataProps {
  selectedWeek: Date;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceData = ({ selectedWeek, filters }: UseWeekResourceDataProps) => {
  // Format week start date for allocations - ensure it's Monday
  const monday = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartDate = format(monday, 'yyyy-MM-dd');
  console.log('Week start date for allocations:', weekStartDate);

  // Get team members
  const {
    members,
    loadingMembers,
    membersError
  } = useWeekResourceTeamMembers();

  // Get projects for the company
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError
  } = useWeekResourceProjects({ filters });

  // Get resource allocations for the selected week
  const {
    data: weekAllocations,
    isLoading: isLoadingAllocations
  } = useWeekResourceAllocations({ weekStartDate });

  // Get leave data (annual leave and holidays)
  const memberIds = members.map(m => m.id);
  const {
    annualLeaveData,
    holidaysData,
    isLoading: isLoadingLeaveData
  } = useWeekResourceLeaveData({ weekStartDate, memberIds });

  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations || isLoadingLeaveData;
  
  // Handle errors
  const error = projectsError || membersError;

  return {
    projects: projects || [],
    members,
    weekAllocations: weekAllocations || [],
    annualLeaveData,
    holidaysData,
    weekStartDate,
    isLoading,
    error
  };
};
