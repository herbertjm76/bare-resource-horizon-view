import { useQuery } from "@tanstack/react-query";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";

export const useWeeklyFilterOptions = () => {
  const { company } = useCompany();

  // Fetch practice areas
  const { data: practiceAreas = [] } = useQuery({
    queryKey: ['office-practice-areas', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_practice_areas')
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
    practiceAreas,
    departments,
    locations
  };
};
