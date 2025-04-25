
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFormOptions = (company: any, isOpen: boolean) => {
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>>([]);
  const [officeStages, setOfficeStages] = useState<Array<{ id: string; name: string; color?: string }>>([]);

  useEffect(() => {
    const fetchFormOptions = async () => {
      if (!company || !company.id) {
        toast.error("No company context found, cannot load project resources.");
        return;
      }
      
      try {
        const { data: mgrs } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('company_id', company.id);

        setManagers(Array.isArray(mgrs)
          ? mgrs.map(u => ({ 
              id: u.id, 
              name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() 
            }))
          : []);

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
          .select('id, name, color')
          .eq('company_id', company.id);

        setOfficeStages(Array.isArray(stages) ? stages : []);
      } catch (error) {
        toast.error("Failed to load form options");
      }
    };

    if (isOpen) {
      fetchFormOptions();
    }
  }, [company, isOpen]);

  return {
    managers,
    countries,
    offices,
    officeStages,
    setOfficeStages
  };
};
