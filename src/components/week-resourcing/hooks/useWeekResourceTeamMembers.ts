
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const useWeekResourceTeamMembers = () => {
  const { company } = useCompany();
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [membersError, setMembersError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!company?.id) return;
      
      setLoadingMembers(true);
      setMembersError(null);
      
      try {
        // Fetch active members
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, location, job_title, weekly_capacity')
          .eq('company_id', company.id);
          
        if (activeError) throw new Error(`Error fetching team members: ${activeError.message}`);
        
        // Fetch pre-registered members 
        const { data: preRegisteredMembers, error: pendingError } = await supabase
          .from('invites')
          .select('id, first_name, last_name, location, job_title, weekly_capacity')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending');
          
        if (pendingError) throw new Error(`Error fetching pre-registered members: ${pendingError.message}`);
        
        // Combine members
        const allMembers = [
          ...(activeMembers || []), 
          ...(preRegisteredMembers || [])
        ];
        
        console.log('Fetched members:', allMembers);
        setMembers(allMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembersError(error instanceof Error ? error : new Error('Unknown error fetching members'));
      } finally {
        setLoadingMembers(false);
      }
    };
    
    fetchTeamMembers();
  }, [company?.id]);

  return {
    members,
    loadingMembers,
    membersError
  };
};
