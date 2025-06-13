
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useWeekResourceAllocations } from './useWeekResourceAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import {
  createAllocationMap,
  calculateMemberWeeklyTotals,
  createMemberTotalFunction,
  createProjectCountFunction,
  createWeeklyLeaveFunction
} from './weekResourceUtils';

interface UseWeekResourceDataProps {
  weekStartDate: string;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceData = (weekStartDate: string, filters: UseWeekResourceDataProps['filters']) => {
  // Get team members (both active and pre-registered)
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

  // Get resource allocations for the selected week (daily data - used for fallback only)
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

  // Fetch detailed annual leave data for the week
  const { weeklyLeaveDetails } = useWeeklyLeaveDetails({ weekStartDate, memberIds });

  // Fetch comprehensive weekly allocations for BOTH active and pre-registered members
  const { comprehensiveWeeklyAllocations } = useComprehensiveAllocations({ weekStartDate, memberIds });

  // Create allocation map from COMPREHENSIVE weekly allocations (not daily weekAllocations)
  // This ensures we're using the correct weekly totals for each member-project combination
  const allocationMap = createAllocationMap(comprehensiveWeeklyAllocations || []);

  // Calculate weekly totals per member from comprehensive allocations (including pre-registered)
  const memberWeeklyTotals = calculateMemberWeeklyTotals(
    comprehensiveWeeklyAllocations || [],
    weekStartDate,
    members
  );

  // Create utility functions
  const getMemberTotal = createMemberTotalFunction(memberWeeklyTotals, comprehensiveWeeklyAllocations || []);
  const getProjectCount = createProjectCountFunction(comprehensiveWeeklyAllocations || []);
  const getWeeklyLeave = createWeeklyLeaveFunction(weeklyLeaveDetails);

  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations || isLoadingLeaveData;
  
  // Handle errors
  const error = projectsError || membersError;

  console.log('=== WEEK RESOURCE DATA SUMMARY ===');
  console.log('Using comprehensive allocations for allocation map:', comprehensiveWeeklyAllocations?.length || 0);
  console.log('Allocation map size:', allocationMap.size);
  console.log('Sample allocation map entries:', Array.from(allocationMap.entries()).slice(0, 5));

  return {
    projects: projects || [],
    members,
    allocations: weekAllocations || [], // Keep for backward compatibility, but not used for main calculations
    allocationMap, // Now correctly populated from comprehensive weekly data
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    weekStartDate,
    isLoading,
    error
  };
};
