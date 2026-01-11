
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { useCompanyId } from "@/hooks/useCompanyId";
import { useResourceAllocations } from './useResourceAllocations';
import { useOfficeMembers } from './useOfficeMembers';
import { useOfficeDisplay } from './useOfficeDisplay';
import { useComprehensiveAllocations } from '@/components/week-resourcing/hooks/useComprehensiveAllocations';
import { useWeeklyLeaveDetails } from '@/components/week-resourcing/hooks/useWeeklyLeaveDetails';
import {
  createAllocationMap,
  calculateMemberWeeklyTotals,
  createMemberTotalFunction,
  createProjectCountFunction,
  createWeeklyLeaveFunction
} from '@/components/week-resourcing/hooks/weekResourceUtils';
import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/utils/logger';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';

export const useWeeklyResourceData = (selectedWeek: Date, filters: { office: string }) => {
  // Track loading state explicitly
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Get company context using centralized hook
  const { companyId, isLoading: companyLoading } = useCompanyId();
  
  // Get current user ID
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });
  
  // Fetch all projects for the company - companyId is only defined when ready
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['company-projects', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name')
        .eq('company_id', companyId)
        .order('code');
      
      if (error) {
        logger.error("Error fetching projects:", error);
        return [];
      }
      
      logger.debug("Fetched projects:", data?.length || 0);
      return data || [];
    },
    enabled: !!companyId
  });
  
  // Get team members data - pass true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers, error: teamMembersError } = useTeamMembersData(true);
  
  // Get pending team members (pre-registered) - only when company is ready
  const { data: preRegisteredMembers = [], isLoading: isLoadingPending, error: pendingError } = useQuery({
    queryKey: ['preRegisteredMembers', session?.user?.id, companyId],
    queryFn: async () => {
      if (!session?.user?.id || !companyId) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, job_title, role, weekly_capacity')
        .eq('company_id', companyId)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
        
      if (error) {
        logger.error("Error fetching pre-registered members:", error);
        return [];
      }
      
      logger.debug("Fetched pre-registered members:", data?.length || 0);
      
      // Transform the pre-registered members to match team member structure
      return data.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40
      }));
    },
    enabled: !!session?.user?.id && !!companyId
  });

  // Get all members combined (active + pre-registered)
  const allMembers = useCallback(() => {
    const combined = [...(teamMembers || []), ...(preRegisteredMembers || [])];
    logger.debug("All members for weekly overview:", combined.length);
    return combined;
  }, [teamMembers, preRegisteredMembers])();

  // Calculate week start date for comprehensive allocations (respect company settings)
  const { startOfWorkWeek } = useAppSettings();
  const weekStartDate = getWeekStartDate(selectedWeek, startOfWorkWeek);
  const weekStartDateString = weekStartDate.toISOString().split('T')[0];

  // Get member IDs for comprehensive allocations
  const memberIds = allMembers?.map(m => m.id) || [];

  // Fetch comprehensive weekly allocations for BOTH active and pre-registered members
  const { comprehensiveWeeklyAllocations } = useComprehensiveAllocations({ 
    weekStartDate: weekStartDateString, 
    memberIds 
  });

  // Fetch detailed annual leave data for the week
  const { weeklyLeaveDetails } = useWeeklyLeaveDetails({ 
    weekStartDate: weekStartDateString, 
    memberIds 
  });

  // Create allocation map from COMPREHENSIVE weekly allocations
  const allocationMap = createAllocationMap(comprehensiveWeeklyAllocations || []);

  // Calculate weekly totals per member from comprehensive allocations
  const memberWeeklyTotals = calculateMemberWeeklyTotals(
    comprehensiveWeeklyAllocations || [],
    weekStartDateString,
    allMembers || []
  );

  // Create utility functions using the comprehensive data
  const getMemberTotal = createMemberTotalFunction(memberWeeklyTotals, comprehensiveWeeklyAllocations || []);
  const getProjectCount = createProjectCountFunction(comprehensiveWeeklyAllocations || []);
  const getWeeklyLeave = createWeeklyLeaveFunction(weeklyLeaveDetails);

  // Legacy resource allocations (kept for compatibility)
  const { 
    memberAllocations,
    getMemberAllocation, 
    handleInputChange, 
    isLoading: isLoadingAllocations,
    error: allocationsError,
    refreshAllocations,
    projectTotals
  } = useResourceAllocations(allMembers, selectedWeek);
  
  // Get office display helper
  const { getOfficeDisplay } = useOfficeDisplay();
  
  // Get members organized by office
  const { membersByOffice, filteredOffices } = useOfficeMembers(allMembers, filters);

  // Clear initialization state when data is loaded
  useEffect(() => {
    // CRITICAL: Include companyLoading in the ready check
    const dataIsReady = !companyLoading && !isLoadingSession && !isLoadingMembers && 
                        !isLoadingPending && !isLoadingProjects && 
                        !isLoadingAllocations && Array.isArray(allMembers);
                         
    if (dataIsReady) {
      // Use a short delay to ensure all data is properly initialized
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [
    companyLoading,
    isLoadingSession, 
    isLoadingMembers, 
    isLoadingPending, 
    isLoadingProjects, 
    isLoadingAllocations, 
    allMembers
  ]);

  // Determine overall loading state - include company loading
  const isLoading = companyLoading || isInitializing || isLoadingSession || isLoadingMembers || 
                    isLoadingPending || isLoadingAllocations || isLoadingProjects;

  // Determine if there are any errors
  const error = teamMembersError || pendingError || allocationsError;

  logger.debug('=== WEEKLY OVERVIEW DATA SUMMARY ===');
  logger.debug('Using comprehensive allocations for allocation map:', comprehensiveWeeklyAllocations?.length || 0);
  logger.debug('Allocation map size:', allocationMap.size);
  logger.debug('Sample allocation map entries:', Array.from(allocationMap.entries()).slice(0, 5));

  return {
    projects,
    allMembers,
    membersByOffice,
    filteredOffices,
    // Legacy functions for compatibility
    getMemberAllocation,
    handleInputChange,
    // New comprehensive functions
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    allocationMap,
    getOfficeDisplay,
    projectTotals,
    refreshAllocations,
    isLoading,
    error
  };
};
