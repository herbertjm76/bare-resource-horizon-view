
import { useState, useEffect, useMemo } from 'react';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useIndividualUtilization } from './useIndividualUtilization';
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
  
  // Combine all team members (active + pre-registered)
  const allTeamMembers = useMemo(() => {
    console.log('=== DASHBOARD DATA HOOK ===');
    console.log('Active team members:', activeTeamMembers?.length || 0);
    console.log('Pre-registered members:', preRegisteredMembers?.length || 0);
    
    const combined = [...(activeTeamMembers || []), ...(preRegisteredMembers || [])];
    console.log('Total combined members:', combined.length);
    console.log('Combined members:', combined.map(m => ({ 
      name: `${m.first_name} ${m.last_name}`, 
      isPending: 'isPending' in m ? m.isPending : false 
    })));
    
    return combined;
  }, [activeTeamMembers, preRegisteredMembers]);

  // Get utilization data for all members
  const { memberUtilizations, isLoading: isLoadingUtilization } = useIndividualUtilization(allTeamMembers);

  // Calculate staff data with proper utilization
  const staffData = useMemo(() => {
    console.log('=== CALCULATING STAFF DATA ===');
    console.log('All team members for staff data:', allTeamMembers.length);
    console.log('Member utilizations:', memberUtilizations);
    
    const staffMembers = allTeamMembers.map(member => {
      const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
      const utilization = memberUtilizations[member.id] || 0;
      
      console.log(`Member: ${memberName}, ID: ${member.id}, Utilization: ${utilization}%`);
      
      return {
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        name: memberName,
        role: member.job_title || 'Team Member',
        availability: utilization,
        avatar_url: 'avatar_url' in member ? member.avatar_url : undefined
      };
    });

    console.log('Final staff data:', staffMembers.map(s => ({ 
      name: s.name, 
      availability: s.availability 
    })));
    console.log('=== END STAFF DATA CALCULATION ===');

    return staffMembers;
  }, [allTeamMembers, memberUtilizations]);

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

  // Calculate metrics
  const metrics = useMemo(() => {
    return {
      activeProjects: 12, // Mock data
      activeResources: allTeamMembers.length,
    };
  }, [allTeamMembers]);

  // Mock utilization trends
  const utilizationTrends = {
    days7: 75,
    days30: 78,
    days90: 82
  };

  // Mock data for charts - ensure all required properties exist
  const mockData = {
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
    projectsByStatus: [
      { name: 'Active', value: 8 },
      { name: 'On Hold', value: 3 },
      { name: 'Completed', value: 12 },
    ],
    projectsByStage: [
      { name: '50% CD', value: 5 },
      { name: '100% CD', value: 4 },
      { name: '50% SD', value: 3 },
    ],
    projectsByRegion: [
      { name: 'North', value: 6 },
      { name: 'South', value: 4 },
      { name: 'East', value: 2 },
    ],
    projectInvoicesThisMonth: [
      { name: 'Paid', value: 8 },
      { name: 'Pending', value: 3 },
      { name: 'Overdue', value: 1 },
    ],
  };

  const isLoading = isLoadingActive || isLoadingUtilization;

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
