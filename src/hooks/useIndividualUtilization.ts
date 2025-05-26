
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { IndividualUtilization } from './utilization/types';
import { initializeUtilizationMap } from './utilization/utils';
import { calculateActiveUtilizations } from './utilization/useActiveMembers';
import { calculatePreRegisteredUtilizations } from './utilization/usePreRegisteredMembers';

export const useIndividualUtilization = (teamMembers: TeamMember[]) => {
  const [individualUtilizations, setIndividualUtilizations] = useState<Record<string, IndividualUtilization>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Separate active and pre-registered members
  const { activeMembers, preRegisteredMembers } = useMemo(() => {
    const active = teamMembers.filter(member => 'company_id' in member && member.company_id);
    const preRegistered = teamMembers.filter(member => !('company_id' in member) || !member.company_id);
    
    console.log('=== MEMBER CATEGORIZATION ===');
    console.log('Active members:', active.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    console.log('Pre-registered members:', preRegistered.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    
    return { activeMembers: active, preRegisteredMembers: preRegistered };
  }, [teamMembers]);

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      console.log('Individual utilization: No company or members, setting loading to false');
      setIsLoading(false);
      return;
    }

    const fetchIndividualUtilizations = async () => {
      setIsLoading(true);
      
      try {
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const ninetyDaysAgo = subWeeks(currentWeekStart, 12);
        
        console.log('=== INDIVIDUAL UTILIZATION CALCULATION ===');
        console.log('Current week start (Monday):', format(currentWeekStart, 'yyyy-MM-dd'));
        console.log('90 days ago week start:', format(ninetyDaysAgo, 'yyyy-MM-dd'));
        
        // Initialize utilization data for all members
        let utilizationMap = initializeUtilizationMap(teamMembers);

        // Calculate utilizations for active members
        const activeUtilizations = await calculateActiveUtilizations(
          activeMembers,
          company.id,
          currentWeekStart,
          ninetyDaysAgo
        );

        // Calculate utilizations for pre-registered members
        const preRegisteredUtilizations = await calculatePreRegisteredUtilizations(
          preRegisteredMembers,
          company.id,
          currentWeekStart,
          ninetyDaysAgo
        );

        // Merge all utilizations
        utilizationMap = {
          ...utilizationMap,
          ...activeUtilizations,
          ...preRegisteredUtilizations
        };

        console.log('Final individual utilizations:', utilizationMap);
        console.log('=== END INDIVIDUAL UTILIZATION DEBUG ===');
        
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
  }, [company?.id, activeMembers, preRegisteredMembers, teamMembers]);

  const getIndividualUtilization = (memberId: string): IndividualUtilization => {
    return individualUtilizations[memberId] || { memberId, days7: 0, days30: 0, days90: 0 };
  };

  return { individualUtilizations, getIndividualUtilization, isLoading };
};
