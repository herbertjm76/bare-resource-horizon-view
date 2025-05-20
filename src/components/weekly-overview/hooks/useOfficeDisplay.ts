
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const useOfficeDisplay = () => {
  const { company } = useCompany();
  
  // Fetch office locations for display
  const { data: officeLocations = [] } = useQuery({
    queryKey: ['office-locations-display', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country, emoji')
        .eq('company_id', company.id);
      
      if (error) {
        console.error('Error fetching office locations:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!company?.id
  });

  // Get formatted office display based on location code
  const getOfficeDisplay = React.useCallback((locationCode: string) => {
    // Handle special cases
    if (!locationCode || locationCode === 'Unassigned') {
      return 'Unassigned';
    }
    
    // Find office in our data
    const office = officeLocations.find(loc => loc.code === locationCode);
    
    if (!office) {
      return locationCode;
    }
    
    // Format with emoji if available
    return office.emoji 
      ? `${office.emoji} ${office.code}`
      : `${office.code} (${office.city})`;
  }, [officeLocations]);
  
  return { getOfficeDisplay };
};
