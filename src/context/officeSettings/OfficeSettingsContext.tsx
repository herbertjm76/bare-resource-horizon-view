import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { 
  Role, 
  Location, 
  Rate, 
  Department,
  Sector, 
  ProjectStage, 
  OfficeSettingsContextType 
} from './types';
import { fetchOfficeSettings } from './fetchOfficeSettings';

export const OfficeSettingsContext = createContext<OfficeSettingsContextType | null>(null);

export const OfficeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [office_stages, setOfficeStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    if (!company) {
      setLoading(false);
      setRoles([]);
      setLocations([]);
      setRates([]);
      setDepartments([]);
      setSectors([]);
      setOfficeStages([]);
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
        setSectors(settings.sectors);
        setOfficeStages(settings.office_stages);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [company]);

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
        sectors,
        setSectors,
        office_stages,
        setOfficeStages,
        loading
      }}
    >
      {children}
    </OfficeSettingsContext.Provider>
  );
};
