
import { useState, useEffect, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  office?: string;
  isPending?: boolean;
  allocations?: Record<string, number | { projectId: string, hours: number }>;
}

// Function to update allocation for a team member
const updateAllocationInDB = async (
  memberId: string, 
  date: string, 
  hours: number
): Promise<boolean> => {
  try {
    // In a real app, this would update the database
    console.log(`Updating allocation for member ${memberId} on ${date}: ${hours} hours`);
    
    // Simulate successful update
    return true;
  } catch (error) {
    console.error('Failed to update allocation:', error);
    return false;
  }
};

export const useWeeklyResourceData = (selectedWeek: Date, filters: { office: string }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { company } = useCompany();
  
  // Generate week days for the selected week
  const weekDays = useMemo(() => {
    const weekStart = new Date(selectedWeek);
    // Adjust to Monday
    const monday = new Date(weekStart);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    
    return Array.from({ length: 5 }, (_, i) => {
      const date = addDays(monday, i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEE'),
        isAnnualLeave: false // Placeholder, would be determined by API call
      };
    });
  }, [selectedWeek]);
  
  // Fetch team members and their allocations
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        
        if (!company?.id) {
          throw new Error('Company ID not available');
        }
        
        // Fetch all profiles for the company
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, job_title, location')
          .eq('company_id', company.id);
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Format profiles as team members
        const formattedMembers: TeamMember[] = profiles.map(profile => ({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          role: profile.job_title || 'Team Member',
          office: profile.location,
          allocations: {} // Will be populated with allocations data
        }));
        
        // Filter by office if specified
        const filteredMembers = filters.office === 'all' 
          ? formattedMembers
          : formattedMembers.filter(member => member.office === filters.office);
        
        setTeamMembers(filteredMembers);
        setError(null);
      } catch (err) {
        console.error('Error loading team data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load team data'));
        toast.error('Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [company?.id, selectedWeek, filters.office]);
  
  // Function to update allocation in the UI and database
  const updateAllocation = async (memberId: string, date: string, hours: number): Promise<boolean> => {
    // Update allocation in the database
    const success = await updateAllocationInDB(memberId, date, hours);
    
    if (success) {
      // Update the local state
      setTeamMembers(prev => 
        prev.map(member => {
          if (member.id === memberId) {
            return {
              ...member,
              allocations: {
                ...(member.allocations || {}),
                [date]: hours
              }
            };
          }
          return member;
        })
      );
    }
    
    return success;
  };
  
  return {
    isLoading,
    error,
    teamMembers,
    weekDays,
    updateAllocation
  };
};
