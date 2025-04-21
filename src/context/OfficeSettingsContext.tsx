
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Updated types WITH company_id
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
};

// Create context
type OfficeSettingsContextType = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  setRates: React.Dispatch<React.SetStateAction<Rate[]>>;
  loading: boolean;
};

const OfficeSettingsContext = createContext<OfficeSettingsContextType | null>(null);

// Provider component
export const OfficeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  // Fetch settings data based on current company
  useEffect(() => {
    if (!company) {
      setLoading(false);
      setRoles([]);
      setLocations([]);
      setRates([]);
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      try {
        // Fetch roles for this company
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('id, name, code, company_id')
          .eq('company_id', company.id);

        if (rolesError) throw rolesError;

        // Fetch locations for this company
        const { data: locationsData, error: locationsError } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji, company_id')
          .eq('company_id', company.id);

        if (locationsError) throw locationsError;

        // Fetch rates for this company
        const { data: ratesData, error: ratesError } = await supabase
          .from('office_rates')
          .select('id, type, reference_id, value, unit, company_id')
          .eq('company_id', company.id);

        if (ratesError) throw ratesError;

        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setLocations(Array.isArray(locationsData) ? locationsData : []);
        
        // Process rates with proper type casting
        if (Array.isArray(ratesData)) {
          const typedRates: Rate[] = ratesData.map(r => ({
            id: r.id,
            type: r.type as "role" | "location", // Cast to the union type
            reference_id: r.reference_id,
            value: Number(r.value), // Convert numeric to number
            unit: r.unit as "hour" | "day" | "week", // Cast to the union type
            company_id: r.company_id
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
        loading
      }}
    >
      {children}
    </OfficeSettingsContext.Provider>
  );
};

// Custom hook to use the context
export const useOfficeSettings = () => {
  const context = useContext(OfficeSettingsContext);
  if (!context) {
    throw new Error('useOfficeSettings must be used within an OfficeSettingsProvider');
  }
  return context;
};
