
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { TimeRange } from '../TimeRangeSelector';
import { useTimeRangeMetrics } from './useTimeRangeMetrics';

export const useDashboardData = (selectedTimeRange: TimeRange) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUtilizationRate, setCurrentUtilizationRate] = useState(0);
  const [utilizationStatus, setUtilizationStatus] = useState({
    status: 'Optimal',
    color: '#10B981',
    textColor: 'text-green-700'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const { company } = useCompany();
  const { metrics: timeRangeMetrics, isLoading: metricsLoading } = useTimeRangeMetrics(selectedTimeRange);

  const fetchDashboardData = useCallback(async () => {
    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', company.id);

      if (membersError) throw membersError;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', company.id);

      if (projectsError) throw projectsError;

      setTeamMembers(membersData || []);
      setProjects(projectsData || []);

      // Calculate utilization (simplified calculation)
      const activeMembers = membersData?.filter(member => member.role && member.role !== 'pending') || [];
      const totalCapacity = activeMembers.reduce((total, member) => total + (member.weekly_capacity || 40), 0);
      
      // Mock utilization calculation - replace with actual logic
      const utilizationRate = Math.min(Math.round((activeMembers.length * 30) / Math.max(totalCapacity, 1) * 100), 100);
      
      setCurrentUtilizationRate(utilizationRate);
      
      // Set utilization status
      if (utilizationRate >= 90) {
        setUtilizationStatus({
          status: 'High Load',
          color: '#ef4444',
          textColor: 'text-red-700'
        });
      } else if (utilizationRate >= 75) {
        setUtilizationStatus({
          status: 'Optimal',
          color: '#22c55e',
          textColor: 'text-green-700'
        });
      } else {
        setUtilizationStatus({
          status: 'Available',
          color: '#3b82f6',
          textColor: 'text-blue-700'
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Create mock data structure with proper location data
  const mockData = {
    projectsByStatus: timeRangeMetrics.projectsByStatus,
    projectsByStage: timeRangeMetrics.projectsByStage,
    projectsByLocation: timeRangeMetrics.projectsByLocation,
    projectsByPM: timeRangeMetrics.projectsByPM || []
  };

  // Mock utilization trends
  const utilizationTrends = {
    days7: currentUtilizationRate,
    days30: Math.round(currentUtilizationRate * 0.9),
    days90: Math.round(currentUtilizationRate * 0.85)
  };

  // Transform team members to staff data format
  const staffData = teamMembers.map(member => ({
    id: member.id,
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
    availability: Math.round(Math.random() * 100), // Mock availability
    weekly_capacity: member.weekly_capacity || 40,
    first_name: member.first_name,
    last_name: member.last_name,
    role: member.role
  }));

  const officeOptions = ['All Offices'];

  return {
    teamMembers,
    projects,
    currentUtilizationRate,
    utilizationStatus,
    isLoading: isLoading || metricsLoading,
    mockData,
    activeResources: timeRangeMetrics.activeResources,
    activeProjects: timeRangeMetrics.activeProjects,
    refetch: fetchDashboardData,
    selectedOffice,
    setSelectedOffice,
    selectedTimeRange,
    setSelectedTimeRange: () => {}, // Will be overridden in DashboardMetrics
    allTeamMembers: teamMembers,
    utilizationTrends,
    metrics: timeRangeMetrics,
    staffData,
    officeOptions
  };
};
