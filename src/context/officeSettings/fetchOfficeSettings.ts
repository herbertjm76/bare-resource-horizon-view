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
    // Run independent queries in parallel (huge win vs sequential awaits)
    const [
      rolesRes,
      locationsRes,
      departmentsRes,
      practiceAreasRes,
      ratesRes,
      stagesRes,
      statusesRes,
      projectTypesRes,
    ] = await Promise.all([
      supabase
        .from('office_roles')
        .select('id, name, code, company_id, created_at, updated_at')
        .eq('company_id', companyId),

      supabase
        .from('office_locations')
        .select('id, city, country, code, emoji, company_id')
        .eq('company_id', companyId),

      supabase
        .from('office_departments')
        .select('id, name, company_id, icon')
        .eq('company_id', companyId),

      supabase
        .from('office_practice_areas')
        .select('id, name, company_id, icon')
        .eq('company_id', companyId),

      supabase
        .from('office_rates')
        .select('id, type, reference_id, value, unit, company_id')
        .eq('company_id', companyId),

      supabase
        .from('office_stages')
        .select('id, name, order_index, company_id, color')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true }),

      supabase
        .from('project_statuses')
        .select('id, name, order_index, company_id, color')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true }),

      supabase
        .from('office_project_types')
        .select('id, name, order_index, company_id, icon, color')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true }),
    ]);

    // Fail hard only for roles + rates + stages + statuses + types (core data); keep others soft.
    if (rolesRes.error) throw rolesRes.error;
    if (ratesRes.error) throw ratesRes.error;
    if (stagesRes.error) throw stagesRes.error;
    if (statusesRes.error) throw statusesRes.error;
    if (projectTypesRes.error) throw projectTypesRes.error;

    if (locationsRes.error) logger.error('Error fetching locations:', locationsRes.error);
    if (departmentsRes.error) logger.error('Error fetching departments:', departmentsRes.error);
    if (practiceAreasRes.error) logger.error('Error fetching practice areas:', practiceAreasRes.error);

    const rolesData = rolesRes.data || [];
    const locationsData = locationsRes.data || [];
    const departmentsData = departmentsRes.data || [];
    const practiceAreasData = practiceAreasRes.data || [];
    const ratesData = ratesRes.data || [];
    const stagesData = stagesRes.data || [];
    const statusesData = statusesRes.data || [];
    const projectTypesData = projectTypesRes.data || [];

    logger.log('Office settings loaded:', {
      roles: rolesData.length,
      locations: locationsData.length,
      departments: departmentsData.length,
      practice_areas: practiceAreasData.length,
      rates: ratesData.length,
      stages: stagesData.length,
      statuses: statusesData.length,
      project_types: projectTypesData.length,
    });

    // Process data
    const processedRoles = Array.isArray(rolesData)
      ? rolesData.map((r) => ({
          id: r.id,
          name: r.name,
          code: r.code,
          company_id: (r.company_id ?? companyId).toString(),
          created_at: r.created_at,
          updated_at: r.updated_at,
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
          color: "#E5DEFF", // Default color
        }))
      : [];

    const processedDepartments = Array.isArray(departmentsData)
      ? departmentsData.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          company_id: (dept.company_id ?? companyId).toString(),
          icon: dept.icon || undefined,
        }))
      : [];

    const processedPracticeAreas = Array.isArray(practiceAreasData)
      ? practiceAreasData.map((practiceArea: any) => ({
          id: practiceArea.id,
          name: practiceArea.name,
          company_id: (practiceArea.company_id ?? companyId).toString(),
          icon: practiceArea.icon || undefined,
        }))
      : [];

    const processedStages = Array.isArray(stagesData)
      ? stagesData.map((stage) => ({
          id: stage.id,
          name: stage.name,
          order_index: stage.order_index,
          company_id: (stage.company_id ?? companyId).toString(),
          color: stage.color || "#E5DEFF", // Default color if none is set
        }))
      : [];

    const processedStatuses = Array.isArray(statusesData)
      ? statusesData.map((status) => ({
          id: status.id,
          name: status.name,
          order_index: status.order_index,
          company_id: (status.company_id ?? companyId).toString(),
          color: status.color || "#6366f1", // Default color if none is set
        }))
      : [];

    const processedProjectTypes = Array.isArray(projectTypesData)
      ? projectTypesData.map((type) => ({
          id: type.id,
          name: type.name,
          order_index: type.order_index,
          company_id: (type.company_id ?? companyId).toString(),
          icon: type.icon || undefined,
          color: type.color || "#6366f1", // Default color if none is set
        }))
      : [];

    // Fix the TypeScript error by properly casting the type property
    const processedRates = Array.isArray(ratesData)
      ? ratesData.map((r) => {
          // Validate that type is either 'role' or 'location'
          const rateType = r.type === "role" ? ("role" as const) : ("location" as const);
          // Validate that unit is one of the allowed values
          const rateUnit = r.unit === "hour" || r.unit === "day" || r.unit === "week"
            ? (r.unit as "hour" | "day" | "week")
            : ("hour" as const);

          return {
            id: r.id,
            type: rateType,
            reference_id: r.reference_id,
            value: Number(r.value),
            unit: rateUnit,
            company_id: (r.company_id ?? companyId).toString(),
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
      project_types: processedProjectTypes,
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
