
import { supabase } from '@/integrations/supabase/client';
import { Role, Location, Rate, Department, ProjectStage } from './types';
import { toast } from 'sonner';

type OfficeSettings = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  departments: Department[];
  office_stages: ProjectStage[];
};

export const fetchOfficeSettings = async (companyId: string): Promise<OfficeSettings> => {
  console.log("Fetching settings for company:", companyId);
  
  try {
    // Fetch roles data
    const { data: rolesData, error: rolesError } = await supabase
      .from('office_roles')
      .select('id, name, code, company_id')
      .eq('company_id', companyId);

    if (rolesError) throw rolesError;

    // Fetch locations data
    let locationsData = [];
    try {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, city, country, code, emoji, company_id')
        .eq('company_id', companyId);
      
      if (error) throw error;
      locationsData = data || [];
    } catch (locationError) {
      console.error('Error fetching locations:', locationError);
      locationsData = [];
    }

    // Fetch departments data
    let departmentsData = [];
    try {
      // Using 'any' type to bypass TypeScript checking since the table was just created
      const { data, error } = await (supabase
        .from('office_departments' as any)
        .select('id, name, company_id')
        .eq('company_id', companyId) as any);
      
      if (error) throw error;
      departmentsData = data || [];
    } catch (deptError) {
      console.error('Error fetching departments:', deptError);
      departmentsData = [];
    }

    // Fetch rates data
    const { data: ratesData, error: ratesError } = await supabase
      .from('office_rates')
      .select('id, type, reference_id, value, unit, company_id')
      .eq('company_id', companyId);

    if (ratesError) throw ratesError;
    
    // Fetch project stages data with colors
    const { data: stagesData, error: stagesError } = await supabase
      .from('office_stages')
      .select('id, name, order_index, company_id, color')
      .eq('company_id', companyId)
      .order('order_index', { ascending: true });
      
    if (stagesError) throw stagesError;

    console.log("Roles data:", rolesData);
    console.log("Locations data:", locationsData);
    console.log("Departments data:", departmentsData);
    console.log("Rates data:", ratesData);
    console.log("Stages data:", stagesData);

    // Process data
    const processedRoles = Array.isArray(rolesData) 
      ? rolesData.map((r) => ({
          id: r.id,
          name: r.name,
          code: r.code,
          company_id: (r.company_id ?? companyId).toString()
        }))
      : [];

    const processedLocations = Array.isArray(locationsData)
      ? locationsData.map((loc) => ({
          id: loc.id,
          city: loc.city,
          country: loc.country,
          code: loc.code,
          emoji: loc.emoji,
          company_id: (loc.company_id ?? companyId).toString(),
          color: "#E5DEFF" // Default color
        }))
      : [];

    const processedDepartments = Array.isArray(departmentsData)
      ? departmentsData.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          company_id: (dept.company_id ?? companyId).toString()
        }))
      : [];
      
    const processedStages = Array.isArray(stagesData)
      ? stagesData.map((stage) => ({
          id: stage.id,
          name: stage.name,
          order_index: stage.order_index,
          company_id: (stage.company_id ?? companyId).toString(),
          color: stage.color || "#E5DEFF" // Default color if none is set
        }))
      : [];

    // Fix the TypeScript error by properly casting the type property
    const processedRates = Array.isArray(ratesData)
      ? ratesData.map(r => {
          // Validate that type is either 'role' or 'location'
          const rateType = r.type === "role" ? "role" as const : "location" as const;
          // Validate that unit is one of the allowed values
          const rateUnit = r.unit === "hour" || r.unit === "day" || r.unit === "week" 
            ? r.unit as "hour" | "day" | "week" 
            : "hour" as const;
            
          return {
            id: r.id,
            type: rateType,
            reference_id: r.reference_id,
            value: Number(r.value),
            unit: rateUnit,
            company_id: (r.company_id ?? companyId).toString()
          };
        })
      : [];

    return {
      roles: processedRoles,
      locations: processedLocations,
      rates: processedRates,
      departments: processedDepartments,
      office_stages: processedStages
    };
  } catch (error: any) {
    console.error('Error fetching office settings:', error);
    toast.error('Failed to load office settings');
    
    // Return empty arrays if there's an error
    return {
      roles: [],
      locations: [],
      rates: [],
      departments: [],
      office_stages: []
    };
  }
};
