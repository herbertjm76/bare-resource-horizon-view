import { supabase } from '@/integrations/supabase/client';
import { Role, Location, Rate, Department, PracticeArea, ProjectStage, ProjectStatus, ProjectType } from './types';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

type OfficeSettings = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  departments: Department[];
  practice_areas: PracticeArea[];
  office_stages: ProjectStage[];
  project_statuses: ProjectStatus[];
  project_types: ProjectType[];
};

export const fetchOfficeSettings = async (companyId: string): Promise<OfficeSettings> => {
  logger.log("Fetching settings for company:", companyId);
  
  // Guard against empty/invalid companyId
  if (!companyId) {
    logger.warn('fetchOfficeSettings called without valid companyId');
    return {
      roles: [],
      locations: [],
      rates: [],
      departments: [],
      practice_areas: [],
      office_stages: [],
      project_statuses: [],
      project_types: []
    };
  }
  
  try {
    // Fetch roles data with timestamps
    const { data: rolesData, error: rolesError } = await supabase
      .from('office_roles')
      .select('id, name, code, company_id, created_at, updated_at')
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
      logger.error('Error fetching locations:', locationError);
      locationsData = [];
    }

    // Fetch departments data
    let departmentsData = [];
    try {
      const { data, error } = await supabase
        .from('office_departments')
        .select('id, name, company_id, icon')
        .eq('company_id', companyId);
      
      if (error) throw error;
      departmentsData = data || [];
    } catch (deptError) {
      logger.error('Error fetching departments:', deptError);
      departmentsData = [];
    }

    // Fetch practice areas data
    let practiceAreasData = [];
    try {
      const { data, error } = await supabase
        .from('office_practice_areas')
        .select('id, name, company_id, icon')
        .eq('company_id', companyId);
      
      if (error) throw error;
      practiceAreasData = data || [];
    } catch (practiceAreaError) {
      logger.error('Error fetching practice areas:', practiceAreaError);
      practiceAreasData = [];
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

    // Fetch project statuses data with colors
    const { data: statusesData, error: statusesError } = await supabase
      .from('project_statuses')
      .select('id, name, order_index, company_id, color')
      .eq('company_id', companyId)
      .order('order_index', { ascending: true });
      
    if (statusesError) throw statusesError;

    // Fetch project types data with colors
    const { data: projectTypesData, error: projectTypesError } = await supabase
      .from('office_project_types')
      .select('id, name, order_index, company_id, icon, color')
      .eq('company_id', companyId)
      .order('order_index', { ascending: true });
      
    if (projectTypesError) throw projectTypesError;

    logger.log("Roles data:", rolesData);
    logger.log("Locations data:", locationsData);
    logger.log("Departments data:", departmentsData);
    logger.log("Practice Areas data:", practiceAreasData);
    logger.log("Rates data:", ratesData);
    logger.log("Stages data:", stagesData);
    logger.log("Statuses data:", statusesData);
    logger.log("Project Types data:", projectTypesData);

    // Process data
    const processedRoles = Array.isArray(rolesData) 
      ? rolesData.map((r) => ({
          id: r.id,
          name: r.name,
          code: r.code,
          company_id: (r.company_id ?? companyId).toString(),
          created_at: r.created_at,
          updated_at: r.updated_at
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
          company_id: (dept.company_id ?? companyId).toString(),
          icon: dept.icon || undefined
        }))
      : [];

    const processedPracticeAreas = Array.isArray(practiceAreasData)
      ? practiceAreasData.map((practiceArea: any) => ({
          id: practiceArea.id,
          name: practiceArea.name,
          company_id: (practiceArea.company_id ?? companyId).toString(),
          icon: practiceArea.icon || undefined
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

    const processedStatuses = Array.isArray(statusesData)
      ? statusesData.map((status) => ({
          id: status.id,
          name: status.name,
          order_index: status.order_index,
          company_id: (status.company_id ?? companyId).toString(),
          color: status.color || "#6366f1" // Default color if none is set
        }))
      : [];

    const processedProjectTypes = Array.isArray(projectTypesData)
      ? projectTypesData.map((type) => ({
          id: type.id,
          name: type.name,
          order_index: type.order_index,
          company_id: (type.company_id ?? companyId).toString(),
          icon: type.icon || undefined,
          color: type.color || "#6366f1" // Default color if none is set
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
      practice_areas: processedPracticeAreas,
      office_stages: processedStages,
      project_statuses: processedStatuses,
      project_types: processedProjectTypes
    };
  } catch (error: any) {
    logger.error('Error fetching office settings:', error);
    toast.error('Failed to load office settings');
    
    // Return empty arrays if there's an error
    return {
      roles: [],
      locations: [],
      rates: [],
      departments: [],
      practice_areas: [],
      office_stages: [],
      project_statuses: [],
      project_types: []
    };
  }
};
