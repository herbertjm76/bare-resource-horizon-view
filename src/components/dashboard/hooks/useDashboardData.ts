
import { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamUtilization } from '@/hooks/useTeamUtilization';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useIndividualUtilization } from '@/hooks/useIndividualUtilization';
import { TimeRange } from '../TimeRangeSelector';

export const useDashboardData = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  
  // Get real data from hooks
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { teamMembers: activeMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  // Get pre-registered members from invites
  const companyId = activeMembers?.[0]?.company_id;
  const { preRegisteredMembers } = useTeamMembersState(companyId, 'owner');
  
  // Combine active and pre-registered members with memoization
  const allTeamMembers = useMemo(() => {
    return [...(activeMembers || []), ...(preRegisteredMembers || [])];
  }, [activeMembers, preRegisteredMembers]);
  
  // Get real utilization data
  const { utilization: utilizationTrends, isLoading: isLoadingUtilization } = useTeamUtilization(allTeamMembers);
  
  // Get individual utilization data for active members only
  const { getIndividualUtilization, isLoading: isLoadingIndividualUtilization } = useIndividualUtilization(activeMembers || []);
  
  // Calculate real metrics from actual data with memoization
  const metrics = useMemo(() => ({
    activeProjects: projects?.length || 0,
    activeResources: allTeamMembers?.length || 0
  }), [projects, allTeamMembers]);

  // Generate staff data with real utilization based on actual allocation data
  const staffData = useMemo(() => {
    if (!allTeamMembers?.length) return [];
    
    console.log('Generating staff data with real utilization for', allTeamMembers.length, 'members');
    
    return allTeamMembers.map((member) => {
      let utilization = 0;
      
      // For active members, use real allocation data
      if ('company_id' in member && member.company_id) {
        const individualUtil = getIndividualUtilization(member.id);
        // Use the time range selected by the user, defaulting to 30-day
        switch (selectedTimeRange) {
          case 'week':
            utilization = individualUtil.days7;
            break;
          case '3months':
            utilization = individualUtil.days90;
            break;
          case 'month':
          default:
            utilization = individualUtil.days30;
            break;
        }
        console.log(`Active member ${member.first_name} ${member.last_name}: ${utilization}% utilization (${selectedTimeRange})`);
      } else {
        // For pre-registered members (invites), utilization is 0
        utilization = 0;
        console.log(`Pre-registered member ${member.first_name} ${member.last_name}: 0% utilization (not yet active)`);
      }
      
      return {
        first_name: member.first_name || 'Unknown',
        last_name: member.last_name || 'Member',
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Team Member',
        role: member.job_title || 'Team Member',
        availability: utilization,
        avatar_url: 'avatar_url' in member ? member.avatar_url : undefined
      };
    });
  }, [allTeamMembers, getIndividualUtilization, selectedTimeRange]);

  // Extract unique offices from projects with memoization
  const officeOptions = useMemo(() => {
    return ['All Offices', ...new Set(projects?.map(p => p.office?.name).filter(Boolean) || [])];
  }, [projects]);

  // Real data for charts based on actual projects with memoization
  const mockData = useMemo(() => ({
    projectsByStatus: [
      { name: 'In Progress', value: projects?.filter(p => p.status === 'In Progress').length || 0 },
      { name: 'Complete', value: projects?.filter(p => p.status === 'Complete').length || 0 },
      { name: 'Planning', value: projects?.filter(p => p.status === 'Planning').length || 0 },
    ].filter(item => item.value > 0),
    projectsByStage: [
      { name: '50% CD', value: projects?.filter(p => p.current_stage === '50% CD').length || 0 },
      { name: '100% CD', value: projects?.filter(p => p.current_stage === '100% CD').length || 0 },
      { name: '50% SD', value: projects?.filter(p => p.current_stage === '50% SD').length || 0 },
    ].filter(item => item.value > 0),
    projectsByRegion: [
      { name: 'Vietnam', value: projects?.filter(p => p.country === 'Vietnam').length || 0 },
      { name: 'United Kingdom', value: projects?.filter(p => p.country === 'United Kingdom').length || 0 },
      { name: 'Singapore', value: projects?.filter(p => p.country === 'Singapore').length || 0 },
      { name: 'Brazil', value: projects?.filter(p => p.country === 'Brazil').length || 0 },
    ].filter(item => item.value > 0),
    projectInvoicesThisMonth: [
      { name: 'Invoiced', value: 12 },
      { name: 'Pending', value: 8 },
      { name: 'Overdue', value: 3 },
    ]
  }), [projects]);

  // Consolidate loading state
  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingUtilization || isLoadingIndividualUtilization;

  return {
    selectedOffice,
    setSelectedOffice,
    selectedTimeRange,
    setSelectedTimeRange,
    allTeamMembers,
    utilizationTrends,
    metrics,
    staffData,
    officeOptions,
    mockData,
    isLoading
  };
};
