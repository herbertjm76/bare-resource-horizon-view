import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
export type Role = {
  id: string;
  name: string;
  code: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  name: string;
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

// Initial data
const initialRoles = [
  { id: "1", name: "Project Manager", code: "PM" },
  { id: "2", name: "Senior Architect", code: "SA" },
  { id: "3", name: "Junior Architect", code: "JA" },
  { id: "4", name: "BIM Coordinator", code: "BIM" }
];

const initialLocations: Location[] = [
  { id: "1", city: "New York", country: "United States", code: "US", emoji: "🇺🇸" },
  { id: "2", city: "London", country: "United Kingdom", code: "GB", emoji: "🇬🇧" },
  { id: "3", city: "Tokyo", country: "Japan", code: "JP", emoji: "🇯🇵" }
];

const initialRates = [
  { id: "1", type: "role" as const, name: "Project Manager", value: 150, unit: "hour" },
  { id: "2", type: "role" as const, name: "Senior Architect", value: 125, unit: "hour" },
  { id: "3", type: "location" as const, name: "New York", value: 140, unit: "hour" },
  { id: "4", type: "location" as const, name: "London", value: 135, unit: "hour" }
];

// Create context
type OfficeSettingsContextType = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  setRates: React.Dispatch<React.SetStateAction<Rate[]>>;
};

const OfficeSettingsContext = createContext<OfficeSettingsContextType | null>(null);

// Provider component
export const OfficeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [rates, setRates] = useState<Rate[]>(initialRates);

  return (
    <OfficeSettingsContext.Provider 
      value={{ 
        roles, 
        setRoles, 
        locations, 
        setLocations, 
        rates, 
        setRates 
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
