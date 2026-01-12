import { useMemo } from 'react';
import { useDashboardTeamMembers, useDashboardProjects } from '@/hooks/queries/useDashboardQueries';
import { useCompany } from '@/context/CompanyContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface ResourceAllocation {
  name: string;
  value: number;
  color: string;
}

export const useResourceAllocationData = () => {
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();
  const { data: teamMembers = [] } = useDashboardTeamMembers(company?.id);
  const { data: projects = [] } = useDashboardProjects(company?.id);

  // Fetch project resource allocations
  // RULEBOOK: ALL allocation reads include both active and pre_registered
  const { data: allocations = [] } = useQuery({
    queryKey: ['resource-allocations', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          *,
          projects!inner(name, status)
        `)
        .eq('company_id', company.id)
        .in('resource_type', ['active', 'pre_registered'])
        .gte('allocation_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Last 30 days
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Calculate resource allocation distribution
  const resourceAllocationData = useMemo((): ResourceAllocation[] => {
    if (!allocations.length || !teamMembers.length) {
      return [
        { name: 'No Data Available', value: 100, color: '#E5E7EB' }
      ];
    }

    // Calculate total capacity
    const totalCapacity = teamMembers.reduce((sum, member) => 
      sum + getMemberCapacity(member.weekly_capacity, workWeekHours), 0
    );

    // Group allocations by project status
    const statusGroups: Record<string, number> = {};
    
    allocations.forEach((allocation: any) => {
      const status = allocation.projects?.status || 'Unknown';
      statusGroups[status] = (statusGroups[status] || 0) + allocation.hours;
    });

    // Calculate allocated hours
    const totalAllocatedHours = Object.values(statusGroups).reduce((sum: number, hours: number) => sum + hours, 0);
    
    // Calculate unallocated capacity (assuming 4 weeks in scope)
    const monthlyCapacity = totalCapacity * 4;
    const unallocatedHours = Math.max(0, monthlyCapacity - totalAllocatedHours);

    const result: ResourceAllocation[] = [];

    // Add project status allocations
    const statusColors: Record<string, string> = {
      'In Progress': '#10B981',
      'Planning': '#F59E0B', 
      'On Hold': '#6B7280',
      'Complete': '#3B82F6'
    };

    Object.entries(statusGroups).forEach(([status, hours]) => {
      const percentage = (hours / monthlyCapacity) * 100;
      if (percentage > 0) {
        result.push({
          name: `${status} Projects`,
          value: Math.round(percentage * 10) / 10,
          color: statusColors[status] || '#8B5CF6'
        });
      }
    });

    // Add unallocated capacity
    if (unallocatedHours > 0) {
      const unallocatedPercentage = (unallocatedHours / monthlyCapacity) * 100;
      result.push({
        name: 'Available Capacity',
        value: Math.round(unallocatedPercentage * 10) / 10,
        color: '#E5E7EB'
      });
    }

    // Sort by value descending
    return result.sort((a, b) => b.value - a.value);
  }, [allocations, teamMembers]);

  return resourceAllocationData;
};