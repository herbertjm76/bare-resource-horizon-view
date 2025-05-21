
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Role = {
  id: string;
  name: string;
  code: string;
  company_id: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  reference_id: string;
  value: number;
  unit: "hour" | "day" | "week";
  company_id: string;
};

export type Location = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id: string;
  color?: string;
};

export type Department = {
  id: string;
  name: string;
  company_id: string;
};

export type ProjectStage = {
  id: string;
  name: string;
  order_index: number;
  company_id: string;
  color?: string;
};

type OfficeSettingsContextType = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  departments: Department[];
  office_stages: ProjectStage[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  setRates: React.Dispatch<React.SetStateAction<Rate[]>>;
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  setOfficeStages: React.Dispatch<React.SetStateAction<ProjectStage[]>>;
  loading: boolean;
};

const OfficeSettingsContext = createContext<OfficeSettingsContextType | null>(null);

export const OfficeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
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
      setOfficeStages([]);
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      try {
        console.log("Fetching settings for company:", company.id);
        
        // Fetch roles data
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('id, name, code, company_id')
          .eq('company_id', company.id);

        if (rolesError) throw rolesError;

        // Fetch locations data
        let locationsData = [];
        try {
          const { data, error } = await supabase
            .from('office_locations')
            .select('id, city, country, code, emoji, company_id')
            .eq('company_id', company.id);
          
          if (error) throw error;
          locationsData = data || [];
        } catch (locationError) {
          console.error('Error fetching locations:', locationError);
          locationsData = [];
        }

        // Fetch departments data
        let departmentsData = [];
        try {
          const { data, error } = await supabase
            .from('office_departments')
            .select('id, name, company_id')
            .eq('company_id', company.id);
          
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
          .eq('company_id', company.id);

        if (ratesError) throw ratesError;
        
        // Fetch project stages data with colors
        const { data: stagesData, error: stagesError } = await supabase
          .from('office_stages')
          .select('id, name, order_index, company_id, color')
          .eq('company_id', company.id)
          .order('order_index', { ascending: true });
          
        if (stagesError) throw stagesError;

        console.log("Roles data:", rolesData);
        console.log("Locations data:", locationsData);
        console.log("Departments data:", departmentsData);
        console.log("Rates data:", ratesData);
        console.log("Stages data:", stagesData);

        // Process roles data
        if (Array.isArray(rolesData)) {
          setRoles(rolesData.map((r) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            company_id: (r.company_id ?? company.id).toString()
          })));
        } else {
          setRoles([]);
        }

        // Process locations data
        if (Array.isArray(locationsData)) {
          setLocations(locationsData.map((loc) => ({
            id: loc.id,
            city: loc.city,
            country: loc.country,
            code: loc.code,
            emoji: loc.emoji,
            company_id: (loc.company_id ?? company.id).toString(),
            color: "#E5DEFF" // Default color
          })));
        } else {
          setLocations([]);
        }

        // Process departments data
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData.map((dept) => ({
            id: dept.id,
            name: dept.name,
            company_id: (dept.company_id ?? company.id).toString()
          })));
        } else {
          setDepartments([]);
        }
        
        // Process project stages data
        if (Array.isArray(stagesData)) {
          console.log("Processing stages with colors:", stagesData);
          setOfficeStages(stagesData.map((stage) => ({
            id: stage.id,
            name: stage.name,
            order_index: stage.order_index,
            company_id: (stage.company_id ?? company.id).toString(),
            color: stage.color || "#E5DEFF" // Default color if none is set
          })));
        } else {
          setOfficeStages([]);
        }

        // Process rates data
        if (Array.isArray(ratesData)) {
          const typedRates: Rate[] = ratesData.map(r => ({
            id: r.id,
            type: r.type === "role" ? "role" : "location",
            reference_id: r.reference_id,
            value: Number(r.value),
            unit: r.unit === "hour" || r.unit === "day" || r.unit === "week" ? r.unit : "hour",
            company_id: (r.company_id ?? company.id).toString()
          }));
          setRates(typedRates);
        } else {
          setRates([]);
        }
      } catch (error: any) {
        console.error('Error fetching office settings:', error);
        toast.error('Failed to load office settings');
        setRoles([]);
        setLocations([]);
        setRates([]);
        setDepartments([]);
        setOfficeStages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
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
        office_stages,
        setOfficeStages,
        loading
      }}
    >
      {children}
    </OfficeSettingsContext.Provider>
  );
};

export const useOfficeSettings = () => {
  const context = useContext(OfficeSettingsContext);
  if (!context) {
    throw new Error('useOfficeSettings must be used within an OfficeSettingsProvider');
  }
  return context;
};
