
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

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
        // Define types for the query responses to avoid deep type instantiation
        type RoleResponse = { data: any[] | null, error: any };
        type LocationResponse = { data: any[] | null, error: any };
        type RateResponse = { data: any[] | null, error: any };

        // Fetch all data in parallel with explicit typing
        const [rolesData, locationsData, ratesData] = await Promise.all([
          supabase.from('office_roles').select('*').eq('company_id', company.id) as Promise<RoleResponse>,
          supabase.from('office_locations').select('*').eq('company_id', company.id) as Promise<LocationResponse>,
          supabase.from('office_rates').select('*').eq('company_id', company.id) as Promise<RateResponse>
        ]);

        // Check for errors in responses
        if (rolesData.error) throw rolesData.error;
        if (locationsData.error) throw locationsData.error;
        if (ratesData.error) throw ratesData.error;

        // Process roles data
        if (rolesData.data) {
          const processedRoles: Role[] = [];
          for (const role of rolesData.data) {
            processedRoles.push({
              id: role.id,
              name: role.name,
              code: role.code,
              company_id: role.company_id
            });
          }
          setRoles(processedRoles);
        } else {
          setRoles([]);
        }
        
        // Process locations data
        if (locationsData.data) {
          const processedLocations: Location[] = [];
          for (const location of locationsData.data) {
            processedLocations.push({
              id: location.id,
              city: location.city,
              country: location.country,
              code: location.code,
              emoji: location.emoji,
              company_id: location.company_id
            });
          }
          setLocations(processedLocations);
        } else {
          setLocations([]);
        }
        
        // Process rates data
        if (ratesData.data) {
          const processedRates: Rate[] = [];
          for (const rate of ratesData.data) {
            processedRates.push({
              id: rate.id,
              type: rate.type as "role" | "location",
              reference_id: rate.reference_id,
              value: Number(rate.value),
              unit: rate.unit as "hour" | "day" | "week",
              company_id: rate.company_id
            });
          }
          setRates(processedRates);
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
