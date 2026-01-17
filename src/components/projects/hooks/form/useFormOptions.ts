
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { DEMO_TEAM_MEMBERS, DEMO_STAGES, DEMO_LOCATIONS, DEMO_PRACTICE_AREAS } from "@/data/demoData";

export const useFormOptions = (company: any, isOpen: boolean) => {
  const { isDemoMode } = useDemoAuth();
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>>([]);
  const [officeStages, setOfficeStages] = useState<Array<{ id: string; name: string; color?: string; code?: string }>>([]);

  useEffect(() => {
    // In demo mode, use demo data directly
    if (isDemoMode && isOpen) {
      setManagers(DEMO_TEAM_MEMBERS.map(m => ({
        id: m.id,
        name: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim()
      })));
      
      setCountries(DEMO_PRACTICE_AREAS.map(a => a.name));
      
      setOffices(DEMO_LOCATIONS.map(o => ({
        id: o.id,
        city: o.city,
        country: o.country,
        code: o.code,
        emoji: o.emoji
      })));
      
      setOfficeStages(DEMO_STAGES.map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        code: s.code
      })));
      return;
    }

    const fetchFormOptions = async () => {
      if (!company || !company.id) {
        toast.error("No company context found, cannot load project resources.");
        return;
      }
      
      try {
        // Fetch only users with project_manager role
        const { data: projectManagerRoles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('company_id', company.id)
          .eq('role', 'project_manager');

        const projectManagerIds = (projectManagerRoles || []).map(r => r.user_id);

        let mgrs: Array<{ id: string; first_name: string | null; last_name: string | null }> = [];
        
        if (projectManagerIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('company_id', company.id)
            .in('id', projectManagerIds);
          
          mgrs = profiles || [];
        }

        setManagers(mgrs.map(u => ({ 
          id: u.id, 
          name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() 
        })));

        const { data: projectAreas } = await supabase
          .from('project_areas')
          .select('name')
          .eq('company_id', company.id);

        const areaNames = Array.from(new Set(Array.isArray(projectAreas)
          ? projectAreas.map(a => a.name).filter(Boolean)
          : [])) as string[];
        setCountries(areaNames);

        const { data: locations } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);

        setOffices(Array.isArray(locations) ? locations : []);

        const { data: stages } = await supabase
          .from('office_stages')
          .select('id, name, color, code')
          .eq('company_id', company.id);

        setOfficeStages(Array.isArray(stages) ? stages : []);
      } catch (error) {
        toast.error("Failed to load form options");
      }
    };

    if (isOpen && !isDemoMode) {
      fetchFormOptions();
    }
  }, [company, isOpen, isDemoMode]);

  return {
    managers,
    countries,
    offices,
    officeStages,
    setOfficeStages
  };
};
