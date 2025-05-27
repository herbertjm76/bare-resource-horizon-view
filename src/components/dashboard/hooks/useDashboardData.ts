
import { useState, useEffect, useMemo } from 'react';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useIndividualUtilization } from './useIndividualUtilization';
import { useTimeRangeMetrics } from './useTimeRangeMetrics';
import { TimeRange } from '../TimeRangeSelector';

export const useDashboardData = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  
  // Get active team members
  const { teamMembers: activeTeamMembers, isLoading: isLoadingActive } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Get pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Get time-range specific metrics
  const { metrics: timeRangeMetrics, isLoading: isLoadingMetrics } = useTimeRangeMetrics(selectedTimeRange);
  
  // Combine all team members (active + pre-registered)
  const allTeamMembers = useMemo(() => {
    console.log('=== DASHBOARD DATA HOOK ===');
    console.log('Active team members:', activeTeamMembers?.length || 0);
    console.log('Pre-registered members:', preRegisteredMembers?.length || 0);
    console.log('Selected time range:', selectedTimeRange);
    
    const combined = [...(activeTeamMembers || []), ...(preRegisteredMembers || [])];
    console.log('Total combined members:', combined.length);
    
    return combined;
  }, [activeTeamMembers, preRegisteredMembers]);

  // Filter team members by selected office
  const filteredTeamMembers = useMemo(() => {
    if (selectedOffice === 'All Offices') {
      return allTeamMembers;
    }
    return allTeamMembers.filter(member => member.location === selectedOffice);
  }, [allTeamMembers, selectedOffice]);

  // Get utilization data for filtered members
  const { memberUtilizations, isLoading: isLoadingUtilization } = useIndividualUtilization(filteredTeamMembers);

  // Calculate staff data with proper utilization and all member properties
  const staffData = useMemo(() => {
    console.log('=== CALCULATING STAFF DATA ===');
    console.log('Filtered team members for staff data:', filteredTeamMembers.length);
    console.log('Member utilizations:', memberUtilizations);
    
    const staffMembers = filteredTeamMembers.map(member => {
      const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
      const utilization = memberUtilizations[member.id] || 0;
      
      return {
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        name: memberName,
        role: member.job_title || 'Team Member',
        availability: utilization,
        avatar_url: 'avatar_url' in member ? member.avatar_url : undefined,
        email: 'email' in member ? member.email : undefined,
        department: 'department' in member ? member.department : undefined,
        location: 'location' in member ? member.location : undefined,
        weekly_capacity: 'weekly_capacity' in member ? member.weekly_capacity : 40,
        isPending: 'isPending' in member ? member.isPending : false
      };
    });

    console.log('Final staff data:', staffMembers.map(s => ({ 
      id: s.id,
      name: s.name, 
      availability: s.availability,
      isPending: s.isPending
    })));
    console.log('=== END STAFF DATA CALCULATION ===');

    return staffMembers;
  }, [filteredTeamMembers, memberUtilizations]);

  // Generate office options from team members
  const officeOptions = useMemo(() => {
    const offices = new Set(['All Offices']);
    allTeamMembers.forEach(member => {
      if (member.location) {
        offices.add(member.location);
      }
    });
    return Array.from(offices);
  }, [allTeamMembers]);

  // Mock utilization trends - replaced with actual data when available
  const utilizationTrends = timeRangeMetrics.utilizationTrends;

  // Use metrics from time range metrics hook
  const metrics = useMemo(() => {
    return {
      activeProjects: timeRangeMetrics.activeProjects,
      activeResources: filteredTeamMembers.length,
    };
  }, [timeRangeMetrics.activeProjects, filteredTeamMembers.length]);

  // Mock data for charts - enhanced with time range metrics
  const mockData = useMemo(() => ({
    weeklyData: [
      { name: 'Mon', utilization: 85, capacity: 100 },
      { name: 'Tue', utilization: 92, capacity: 100 },
      { name: 'Wed', utilization: 78, capacity: 100 },
      { name: 'Thu', utilization: 88, capacity: 100 },
      { name: 'Fri', utilization: 95, capacity: 100 },
    ],
    projectTypes: [
      { name: 'Architecture', value: 35, color: '#8B5CF6' },
      { name: 'Interior Design', value: 28, color: '#06B6D4' },
      { name: 'Planning', value: 22, color: '#10B981' },
      { name: 'Consulting', value: 15, color: '#F59E0B' },
    ],
    projectsByStatus: timeRangeMetrics.projectsByStatus.length > 0 
      ? timeRangeMetrics.projectsByStatus 
      : [
          { name: 'Active', value: 8 },
          { name: 'On Hold', value: 3 },
          { name: 'Completed', value: 12 },
        ],
    projectsByStage: timeRangeMetrics.projectsByStage.length > 0 
      ? timeRangeMetrics.projectsByStage 
      : [
          { name: '50% CD', value: 5 },
          { name: '100% CD', value: 4 },
          { name: '50% SD', value: 3 },
        ],
    projectsByRegion: timeRangeMetrics.projectsByRegion.length > 0 
      ? timeRangeMetrics.projectsByRegion 
      : [
          { name: 'North', value: 6 },
          { name: 'South', value: 4 },
          { name: 'East', value: 2 },
        ],
    projectInvoicesThisMonth: [
      { name: 'Paid', value: 8 },
      { name: 'Pending', value: 3 },
      { name: 'Overdue', value: 1 },
    ],
  }), [timeRangeMetrics]);

  const isLoading = isLoadingActive || isLoadingUtilization || isLoadingMetrics;

  return {
    selectedOffice,
    setSelectedOffice,
    selectedTimeRange,
    setSelectedTimeRange,
    allTeamMembers: filteredTeamMembers,
    utilizationTrends,
    metrics,
    staffData,
    officeOptions,
    mockData,
    isLoading
  };
};
