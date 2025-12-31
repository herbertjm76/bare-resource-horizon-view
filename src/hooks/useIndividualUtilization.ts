
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { IndividualUtilization } from './utilization/types';
import { initializeUtilizationMap } from './utilization/utils';
import { calculateActiveUtilizations } from './utilization/useActiveMembers';
import { calculatePreRegisteredUtilizations } from './utilization/usePreRegisteredMembers';
import { logger } from '@/utils/logger';

export const useIndividualUtilization = (teamMembers: TeamMember[]) => {
  const [individualUtilizations, setIndividualUtilizations] = useState<Record<string, IndividualUtilization>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();

  // Separate active and pre-registered members
  const { activeMembers, preRegisteredMembers } = useMemo(() => {
    const active = teamMembers.filter(member => 'company_id' in member && member.company_id);
    const preRegistered = teamMembers.filter(member => !('company_id' in member) || !member.company_id);
    
    logger.debug('=== MEMBER CATEGORIZATION ===');
    logger.debug('Active members:', active.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    logger.debug('Pre-registered members:', preRegistered.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    
    return { activeMembers: active, preRegisteredMembers: preRegistered };
  }, [teamMembers]);

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      logger.debug('Individual utilization: No company or members, setting loading to false');
      setIsLoading(false);
      return;
    }

    const fetchIndividualUtilizations = async () => {
      setIsLoading(true);
      
      try {
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const ninetyDaysAgo = subWeeks(currentWeekStart, 12);
        
        logger.debug('=== INDIVIDUAL UTILIZATION CALCULATION ===');
        logger.debug('Current week start (Monday):', format(currentWeekStart, 'yyyy-MM-dd'));
        logger.debug('90 days ago week start:', format(ninetyDaysAgo, 'yyyy-MM-dd'));
        
        // Initialize utilization data for all members
        let utilizationMap = initializeUtilizationMap(teamMembers);

        // Calculate utilizations for active members
        const activeUtilizations = await calculateActiveUtilizations(
          activeMembers,
          company.id,
          currentWeekStart,
          ninetyDaysAgo,
          workWeekHours
        );

        // Calculate utilizations for pre-registered members
        const preRegisteredUtilizations = await calculatePreRegisteredUtilizations(
          preRegisteredMembers,
          company.id,
          currentWeekStart,
          ninetyDaysAgo,
          workWeekHours
        );

        // Merge all utilizations
        utilizationMap = {
          ...utilizationMap,
          ...activeUtilizations,
          ...preRegisteredUtilizations
        };

        logger.debug('Final individual utilizations:', utilizationMap);
        logger.debug('=== END INDIVIDUAL UTILIZATION DEBUG ===');
        
        setIndividualUtilizations(utilizationMap);
      } catch (error) {
        console.error('Error calculating individual utilizations:', error);
        // Initialize with zeros on error
        const errorMap = initializeUtilizationMap(teamMembers);
        setIndividualUtilizations(errorMap);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndividualUtilizations();
  }, [company?.id, activeMembers, preRegisteredMembers, teamMembers, workWeekHours]);

  const getIndividualUtilization = (memberId: string): IndividualUtilization => {
    return individualUtilizations[memberId] || { memberId, days7: 0, days30: 0, days90: 0 };
  };

  return { individualUtilizations, getIndividualUtilization, isLoading };
};
