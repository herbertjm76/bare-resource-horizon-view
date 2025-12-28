
import { useCallback } from 'react';
import { useCompanyId } from '@/hooks/useCompanyId';
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
  const { companyId } = useCompanyId();
  
  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async (
    teamMembers: TeamMember[], 
    selectedWeek: Date,
    setMemberAllocations: (allocations: Record<string, MemberAllocation>) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | Error | null) => void
  ) => {
    if (!teamMembers || teamMembers.length === 0) {
      console.log('No team members to fetch allocations for');
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
      projectAllocations = await fetchPreciseDateAllocations(memberIds, selectedWeek, companyId);
      
      // 2. If no allocations found with exact match, try a date range query
      if (projectAllocations.length === 0) {
        projectAllocations = await fetchDateRangeAllocations(memberIds, selectedWeek, companyId);
      }
      
      // 3. As a last resort, try to fetch any recent allocations to help debug
      if (projectAllocations.length === 0) {
        projectAllocations = await fetchRecentAllocations(memberIds, companyId);
      }
      
      console.log('Project allocations before processing:', projectAllocations);
      
      // Process the allocations into the expected format
      const initialAllocations = processMemberAllocations(teamMembers, projectAllocations);
      
      console.log('Processed allocations:', initialAllocations);
      setMemberAllocations(initialAllocations);
    } catch (err) {
      console.error('Error fetching allocations:', err);
      const error = err instanceof Error ? err : new Error('Failed to fetch resource allocations');
      setError(error);
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);
  
  return { fetchAllocations };
}
