
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types
export type Role = {
  id: string;
  name: string;
  code: string;
  company_id?: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  reference_id: string; // ID of the role or location
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
        // Fetch roles for this company
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('*')
          .eq('company_id', company.id);

        if (rolesError) throw rolesError;
        
        // Fetch locations for this company
        const { data: locationsData, error: locationsError } = await supabase
          .from('office_locations')
          .select('*')
          .eq('company_id', company.id);

        if (locationsError) throw locationsError;
        
        // Fetch rates for this company
        const { data: ratesData, error: ratesError } = await supabase
          .from('office_rates')
          .select('*')
          .eq('company_id', company.id);

        if (ratesError) throw ratesError;

        // Set the data in state with explicit typing to avoid deep instantiation errors
        if (rolesData) {
          setRoles(rolesData as Role[]);
        } else {
          setRoles([]);
        }
        
        if (locationsData) {
          setLocations(locationsData as Location[]);
        } else {
          setLocations([]);
        }
        
        // Transform rates data to match our Rate type with proper type handling
        if (ratesData) {
          // Explicitly type and transform the data
          const transformedRates = ratesData.map(rate => ({
            id: rate.id,
            type: rate.type as "role" | "location",
            reference_id: rate.reference_id,
            value: Number(rate.value),
            unit: rate.unit as "hour" | "day" | "week",
            // Only add company_id if it exists in the database response
            ...(rate.company_id && { company_id: rate.company_id })
          }));
          
          setRates(transformedRates);
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
