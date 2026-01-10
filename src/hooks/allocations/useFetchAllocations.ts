
import { useCallback } from 'react';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useCompany } from '@/context/CompanyContext';
import { MemberAllocation } from '@/components/weekly-overview/types';
import { toast } from 'sonner';
import {
  fetchPreciseDateAllocations,
  fetchDateRangeAllocations,
} from './utils/fetchUtils';
import { processMemberAllocations } from './utils/processingUtils';
import { logger } from '@/utils/logger';
import { getAllocationWeekKey, getWeekRange, type WeekStartDay } from '@/utils/allocationWeek';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Hook for fetching resource allocations from the database.
 * Uses the canonical allocationWeek module for week key generation.
 */
export function useFetchAllocations() {
  const { companyId } = useCompanyId();
  const { company } = useCompany();
  
  // Get company's week start day
  const weekStartDay = (company?.start_of_work_week as WeekStartDay) || 'Monday';
  
  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async (
    teamMembers: TeamMember[], 
    selectedWeek: Date,
    setMemberAllocations: (allocations: Record<string, MemberAllocation>) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | Error | null) => void
  ) => {
    if (!teamMembers || teamMembers.length === 0) {
      logger.log('No team members to fetch allocations for');
      setIsLoading(false);
      setMemberAllocations({});
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get canonical week key using rulebook
      const weekKey = getAllocationWeekKey(selectedWeek, weekStartDay);
      logger.log('Fetching allocations for canonical week key:', weekKey);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      logger.log('Fetching allocations for members:', memberIds.length);
      
      // Fetch with precise week key (DB triggers ensure this is normalized)
      let projectAllocations = await fetchPreciseDateAllocations(
        memberIds, 
        selectedWeek, 
        companyId,
        weekStartDay
      );
      
      // If no data for exact week, try a small range (±1 week) for edge cases
      if (projectAllocations.length === 0) {
        const { start, end } = getWeekRange(weekKey);
        projectAllocations = await fetchDateRangeAllocations(
          memberIds, 
          start, 
          end, 
          companyId
        );
      }
      
      logger.log('Project allocations before processing:', projectAllocations);
      
      // Process the allocations into the expected format
      const initialAllocations = processMemberAllocations(teamMembers, projectAllocations);
      
      logger.log('Processed allocations:', initialAllocations);
      setMemberAllocations(initialAllocations);
    } catch (err) {
      logger.error('Error fetching allocations:', err);
      const error = err instanceof Error ? err : new Error('Failed to fetch resource allocations');
      setError(error);
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, weekStartDay]);
  
  return { fetchAllocations };
}
