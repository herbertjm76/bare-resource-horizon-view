
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
        // Fetch all data in parallel
        const [rolesData, locationsData, ratesData] = await Promise.all([
          supabase.from('office_roles').select('*').eq('company_id', company.id),
          supabase.from('office_locations').select('*').eq('company_id', company.id),
          supabase.from('office_rates').select('*').eq('company_id', company.id)
        ]);

        // Check for errors in responses
        if (rolesData.error) throw rolesData.error;
        if (locationsData.error) throw locationsData.error;
        if (ratesData.error) throw ratesData.error;

        // Process roles data with safer type handling
        if (rolesData.data) {
          const processedRoles: Role[] = rolesData.data.map(role => ({
            id: role.id,
            name: role.name,
            code: role.code,
            company_id: role.company_id
          }));
          setRoles(processedRoles);
        } else {
          setRoles([]);
        }
        
        // Process locations data with safer type handling
        if (locationsData.data) {
          const processedLocations: Location[] = locationsData.data.map(location => ({
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
        
        // Process rates data with safer type handling
        if (ratesData.data) {
          const processedRates: Rate[] = ratesData.data.map(rate => ({
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
