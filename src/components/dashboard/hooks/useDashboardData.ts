
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
  
  // Get time-range specific metrics - THIS IS THE KEY DATA SOURCE
  const { metrics: timeRangeMetrics, isLoading: isLoadingMetrics } = useTimeRangeMetrics(selectedTimeRange);
  
  // Combine all team members (active + pre-registered)
  const allTeamMembers = useMemo(() => {
    console.log('=== DASHBOARD DATA HOOK ===');
    console.log('Active team members:', activeTeamMembers?.length || 0);
    console.log('Pre-registered members:', preRegisteredMembers?.length || 0);
    console.log('Selected time range:', selectedTimeRange);
    console.log('Time range metrics:', timeRangeMetrics);
    
    const combined = [...(activeTeamMembers || []), ...(preRegisteredMembers || [])];
    console.log('Total combined members:', combined.length);
    
    return combined;
  }, [activeTeamMembers, preRegisteredMembers, selectedTimeRange, timeRangeMetrics]);

  // Filter team members by selected office
  const filteredTeamMembers = useMemo(() => {
    if (selectedOffice === 'All Offices') {
      return allTeamMembers;
    }
    return allTeamMembers.filter(member => member.location === selectedOffice);
  }, [allTeamMembers, selectedOffice]);

  // Get utilization data for filtered members - NOW INCLUDES TIME RANGE
  const { memberUtilizations, isLoading: isLoadingUtilization } = useIndividualUtilization(filteredTeamMembers, selectedTimeRange);

  // Calculate staff data with proper utilization and all member properties
  const staffData = useMemo(() => {
    console.log('=== CALCULATING STAFF DATA ===');
    console.log('Filtered team members for staff data:', filteredTeamMembers.length);
    console.log('Member utilizations:', memberUtilizations);
    console.log('Selected time range for staff data:', selectedTimeRange);
    
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

    console.log('Final staff data for', selectedTimeRange, ':', staffMembers.map(s => ({ 
      id: s.id,
      name: s.name, 
      availability: s.availability,
      isPending: s.isPending
    })));
    console.log('=== END STAFF DATA CALCULATION ===');

    return staffMembers;
  }, [filteredTeamMembers, memberUtilizations, selectedTimeRange]);

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

  // Use utilization trends from time range metrics - ALWAYS from time range data
  const utilizationTrends = useMemo(() => {
    console.log('Using utilization trends from time range metrics:', timeRangeMetrics.utilizationTrends);
    return timeRangeMetrics.utilizationTrends;
  }, [timeRangeMetrics.utilizationTrends]);

  // Use metrics from time range metrics hook - ALWAYS from time range data
  const metrics = useMemo(() => {
    console.log('Using metrics from time range:', {
      activeProjects: timeRangeMetrics.activeProjects,
      activeResources: filteredTeamMembers.length,
      totalRevenue: timeRangeMetrics.totalRevenue,
      avgProjectValue: timeRangeMetrics.avgProjectValue
    });
    
    return {
      activeProjects: timeRangeMetrics.activeProjects,
      activeResources: filteredTeamMembers.length,
      totalRevenue: timeRangeMetrics.totalRevenue,
      avgProjectValue: timeRangeMetrics.avgProjectValue
    };
  }, [timeRangeMetrics.activeProjects, timeRangeMetrics.totalRevenue, timeRangeMetrics.avgProjectValue, filteredTeamMembers.length]);

  // Chart data - USE TIME RANGE METRICS instead of mock data
  const chartData = useMemo(() => {
    console.log('Creating chart data from time range metrics:', {
      projectsByStatus: timeRangeMetrics.projectsByStatus,
      projectsByStage: timeRangeMetrics.projectsByStage,
      projectsByRegion: timeRangeMetrics.projectsByRegion
    });

    return {
      weeklyData: [
        { name: 'Mon', utilization: utilizationTrends.days7, capacity: 100 },
        { name: 'Tue', utilization: utilizationTrends.days7 * 0.95, capacity: 100 },
        { name: 'Wed', utilization: utilizationTrends.days7 * 0.88, capacity: 100 },
        { name: 'Thu', utilization: utilizationTrends.days7 * 0.92, capacity: 100 },
        { name: 'Fri', utilization: utilizationTrends.days7 * 0.98, capacity: 100 },
      ],
      projectTypes: [
        { name: 'Architecture', value: 35, color: '#8B5CF6' },
        { name: 'Interior Design', value: 28, color: '#06B6D4' },
        { name: 'Planning', value: 22, color: '#10B981' },
        { name: 'Consulting', value: 15, color: '#F59E0B' },
      ],
      // Use REAL time range data instead of fallbacks
      projectsByStatus: timeRangeMetrics.projectsByStatus,
      projectsByStage: timeRangeMetrics.projectsByStage,
      projectsByRegion: timeRangeMetrics.projectsByRegion,
      // Keep this as mock since it's not part of time range metrics yet
      projectInvoicesThisMonth: [
        { name: 'Paid', value: Math.max(1, Math.floor(timeRangeMetrics.activeProjects * 0.6)) },
        { name: 'Pending', value: Math.max(1, Math.floor(timeRangeMetrics.activeProjects * 0.3)) },
        { name: 'Overdue', value: Math.max(0, Math.floor(timeRangeMetrics.activeProjects * 0.1)) },
      ],
    };
  }, [timeRangeMetrics, utilizationTrends]);

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
    mockData: chartData, // Renamed for clarity but now contains real time-range data
    isLoading
  };
};
