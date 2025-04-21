
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
        // Define explicit return types for Supabase queries to avoid deep type instantiation
        type SupabaseRoleRow = {
          id: string;
          name: string;
          code: string;
          company_id?: string;
          created_at: string;
          updated_at: string;
        };
        
        type SupabaseLocationRow = {
          id: string;
          city: string;
          country: string;
          code: string;
          emoji?: string;
          company_id?: string;
          created_at: string;
          updated_at: string;
        };
        
        type SupabaseRateRow = {
          id: string;
          type: string;
          reference_id: string;
          value: number;
          unit: string;
          company_id?: string;
          created_at: string;
          updated_at: string;
        };

        // Manually cast Supabase responses to avoid TypeScript depth issues
        const { data: rolesData, error: rolesError } = await supabase
          .from('office_roles')
          .select('*')
          .eq('company_id', company.id);
        
        if (rolesError) throw rolesError;
          
        const { data: locationsData, error: locationsError } = await supabase
          .from('office_locations')
          .select('*')
          .eq('company_id', company.id);
          
        if (locationsError) throw locationsError;
          
        const { data: ratesData, error: ratesError } = await supabase
          .from('office_rates')
          .select('*')
          .eq('company_id', company.id);
          
        if (ratesError) throw ratesError;

        // Process roles data with manual typing
        if (rolesData) {
          const processedRoles: Role[] = (rolesData as SupabaseRoleRow[]).map(role => ({
            id: role.id,
            name: role.name,
            code: role.code,
            company_id: role.company_id
          }));
          setRoles(processedRoles);
        } else {
          setRoles([]);
        }
        
        // Process locations data with manual typing
        if (locationsData) {
          const processedLocations: Location[] = (locationsData as SupabaseLocationRow[]).map(location => ({
            id: location.id,
            city: location.city,
            country: location.country,
            code: location.code,
            emoji: location.emoji,
            company_id: location.company_id
          }));
          setLocations(processedLocations);
        } else {
          setLocations([]);
        }
        
        // Process rates data with manual typing
        if (ratesData) {
          const processedRates: Rate[] = (ratesData as SupabaseRateRow[]).map(rate => ({
            id: rate.id,
            type: rate.type as "role" | "location",
            reference_id: rate.reference_id,
            value: Number(rate.value),
            unit: rate.unit as "hour" | "day" | "week",
            company_id: rate.company_id
          }));
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
