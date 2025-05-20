
import { useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { MemberAllocation } from '@/components/weekly-overview/types';
import { toast } from 'sonner';
import {
  fetchPreciseDateAllocations,
  fetchDateRangeAllocations,
  fetchRecentAllocations
} from './utils/fetchUtils';
import { processMemberAllocations } from './utils/processingUtils';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Hook for fetching resource allocations from the database
 */
export function useFetchAllocations() {
  const { company } = useCompany();
  
  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async (
    teamMembers: TeamMember[], 
    selectedWeek: Date,
    setMemberAllocations: (allocations: Record<string, MemberAllocation>) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | Error | null) => void
  ) => {
    if (!teamMembers || teamMembers.length === 0) {
      setIsLoading(false);
      setMemberAllocations({});
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Selected week JS date:', selectedWeek);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      console.log('Fetching allocations for members:', memberIds.length);
      
      // Try different fetching strategies in sequence until we get data
      let projectAllocations = [];
      
      // 1. First try precise date matching (Monday or Sunday)
      projectAllocations = await fetchPreciseDateAllocations(memberIds, selectedWeek, company?.id);
      
      // 2. If no allocations found with exact match, try a date range query
      if (projectAllocations.length === 0) {
        projectAllocations = await fetchDateRangeAllocations(memberIds, selectedWeek, company?.id);
      }
      
      // 3. As a last resort, try to fetch any recent allocations to help debug
      if (projectAllocations.length === 0) {
        projectAllocations = await fetchRecentAllocations(memberIds, company?.id);
      }
      
      console.log('Project allocations before processing:', projectAllocations);
      
      // Process the allocations into the expected format
      const initialAllocations = processMemberAllocations(teamMembers, projectAllocations);
      
      console.log('Processed allocations:', initialAllocations);
      setMemberAllocations(initialAllocations);
    } catch (err) {
      console.error('Error fetching allocations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch resource allocations'));
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);
  
  return { fetchAllocations };
}
