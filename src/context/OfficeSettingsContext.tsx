
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types without company_id to match the database structure
export type Role = {
  id: string;
  name: string;
  code: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  reference_id: string; 
  value: number;
  unit: "hour" | "day" | "week";
};

export type Location = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
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
        // Fetch roles - remove company_id from the query
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('id, name, code');
        
        if (rolesError) throw rolesError;
        
        // Fetch locations - remove company_id from the query
        const { data: locationsData, error: locationsError } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji');
        
        if (locationsError) throw locationsError;
        
        // Fetch rates - remove company_id from the query
        const { data: ratesData, error: ratesError } = await supabase
          .from('office_rates')
          .select('id, type, reference_id, value, unit');
        
        if (ratesError) throw ratesError;

        // Process data with explicit casting to avoid deep type instantiation
        if (rolesData) {
          const typedRoles: Role[] = rolesData.map(role => ({
            id: role.id,
            name: role.name,
            code: role.code
          }));
          setRoles(typedRoles);
        } else {
          setRoles([]);
        }
        
        if (locationsData) {
          const typedLocations: Location[] = locationsData.map(location => ({
            id: location.id,
            city: location.city,
            country: location.country,
            code: location.code,
            emoji: location.emoji
          }));
          setLocations(typedLocations);
        } else {
          setLocations([]);
        }
        
        if (ratesData) {
          const typedRates: Rate[] = [];
          for (const rate of ratesData) {
            typedRates.push({
              id: rate.id,
              type: rate.type as "role" | "location",
              reference_id: rate.reference_id,
              value: Number(rate.value),
              unit: rate.unit as "hour" | "day" | "week"
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
