import { useQuery } from "@tanstack/react-query";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { DEMO_PRACTICE_AREAS, DEMO_DEPARTMENTS, DEMO_LOCATIONS, DEMO_COMPANY_ID } from "@/data/demoData";

export const useWeeklyFilterOptions = () => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  
  const companyId = isDemoMode ? DEMO_COMPANY_ID : company?.id;

  // Fetch practice areas
  const { data: practiceAreas = [] } = useQuery({
    queryKey: ['office-practice-areas', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_PRACTICE_AREAS.map(pa => ({
          id: pa.id,
          name: pa.name,
          icon: pa.icon
        }));
      }
      
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_practice_areas')
        .select('id, name, icon')
        .eq('company_id', company.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: isDemoMode || !!company?.id
  });

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['office-departments', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_DEPARTMENTS.map(d => ({
          id: d.id,
          name: d.name,
          icon: d.icon
        }));
      }
      
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_departments')
        .select('id, name, icon')
        .eq('company_id', company.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: isDemoMode || !!company?.id
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['office-locations', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_LOCATIONS.map(l => ({
          id: l.id,
          code: l.code,
          city: l.city,
          country: l.country,
          emoji: l.emoji
        }));
      }
      
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country, emoji')
        .eq('company_id', company.id)
        .order('city');
      
      if (error) throw error;
      return data;
    },
    enabled: isDemoMode || !!company?.id
  });

  return {
    practiceAreas,
    departments,
    locations
  };
};
