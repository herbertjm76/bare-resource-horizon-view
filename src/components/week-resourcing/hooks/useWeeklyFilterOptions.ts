import { useQuery } from "@tanstack/react-query";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";

export const useWeeklyFilterOptions = () => {
  const { company } = useCompany();

  // Fetch sectors
  const { data: sectors = [] } = useQuery({
    queryKey: ['office-sectors', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_sectors')
        .select('id, name, icon')
        .eq('company_id', company.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['office-departments', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_departments')
        .select('id, name, icon')
        .eq('company_id', company.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['office-locations', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country, emoji')
        .eq('company_id', company.id)
        .order('city');
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  return {
    sectors,
    departments,
    locations
  };
};
