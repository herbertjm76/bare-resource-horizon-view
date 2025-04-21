
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types with optional company_id to match the database
export type Role = {
  id: string;
  name: string;
  code: string;
  company_id?: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  reference_id: string; 
  value: number;
  unit: "hour" | "day" | "week";
  company_id?: string;
};

export type Location = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id?: string;
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
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      try {
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('id, name, code, company_id')
          .eq('company_id', company.id);
        
        if (rolesError) throw rolesError;
        
        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji, company_id')
          .eq('company_id', company.id);
        
        if (locationsError) throw locationsError;
        
        // Fetch rates
        const { data: ratesData, error: ratesError } = await supabase
          .from('office_rates')
          .select('id, type, reference_id, value, unit, company_id')
          .eq('company_id', company.id);
        
        if (ratesError) throw ratesError;

        // Process data using simpler approach that avoids deep type instantiation
        setRoles(rolesData || []);
        setLocations(locationsData || []);
        
        // Process rates with explicit type casting for specialized fields
        if (ratesData) {
          const typedRates: Rate[] = [];
          for (const rate of ratesData) {
            typedRates.push({
              id: rate.id,
              type: rate.type as "role" | "location",
              reference_id: rate.reference_id,
              value: Number(rate.value),
              unit: rate.unit as "hour" | "day" | "week",
              company_id: rate.company_id
            });
          }
          setRates(typedRates);
        } else {
          setRates([]);
        }
      } catch (error: any) {
        console.error('Error fetching office settings:', error);
        toast.error('Failed to load office settings');
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
