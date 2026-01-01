import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { 
  Role, 
  Location, 
  Rate, 
  Department,
  PracticeArea, 
  ProjectStage,
  ProjectStatus,
  ProjectType,
  OfficeSettingsContextType 
} from './types';
import { fetchOfficeSettings } from './fetchOfficeSettings';
import { 
  DEMO_ROLES, 
  DEMO_LOCATIONS, 
  DEMO_RATES, 
  DEMO_DEPARTMENTS, 
  DEMO_PRACTICE_AREAS, 
  DEMO_STAGES, 
  DEMO_PROJECT_STATUSES, 
  DEMO_PROJECT_TYPES 
} from '@/data/demoData';

export const OfficeSettingsContext = createContext<OfficeSettingsContextType | null>(null);

export const OfficeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [practice_areas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [office_stages, setOfficeStages] = useState<ProjectStage[]>([]);
  const [project_statuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [project_types, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  useEffect(() => {
    // Demo mode: load demo office settings
    if (isDemoMode) {
      setRoles(DEMO_ROLES);
      setLocations(DEMO_LOCATIONS.map(loc => ({ ...loc, color: '#E5DEFF' })));
      setRates(DEMO_RATES);
      setDepartments(DEMO_DEPARTMENTS);
      setPracticeAreas(DEMO_PRACTICE_AREAS);
      setOfficeStages(DEMO_STAGES);
      setProjectStatuses(DEMO_PROJECT_STATUSES);
      setProjectTypes(DEMO_PROJECT_TYPES);
      setLoading(false);
      return;
    }

    if (!company) {
      setLoading(false);
      setRoles([]);
      setLocations([]);
      setRates([]);
      setDepartments([]);
      setPracticeAreas([]);
      setOfficeStages([]);
      setProjectStatuses([]);
      setProjectTypes([]);
      return;
    }

    const loadSettings = async () => {
      setLoading(true);
      
      try {
        const settings = await fetchOfficeSettings(company.id);
        
        setRoles(settings.roles);
        setLocations(settings.locations);
        setRates(settings.rates);
        setDepartments(settings.departments);
        setPracticeAreas(settings.practice_areas);
        setOfficeStages(settings.office_stages);
        setProjectStatuses(settings.project_statuses);
        setProjectTypes(settings.project_types);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [company, isDemoMode]);

  return (
    <OfficeSettingsContext.Provider 
      value={{ 
        roles, 
        setRoles, 
        locations, 
        setLocations, 
        rates, 
        setRates,
        departments,
        setDepartments,
        practice_areas,
        setPracticeAreas,
        office_stages,
        setOfficeStages,
        project_statuses,
        setProjectStatuses,
        project_types,
        setProjectTypes,
        loading
      }}
    >
      {children}
    </OfficeSettingsContext.Provider>
  );
};
