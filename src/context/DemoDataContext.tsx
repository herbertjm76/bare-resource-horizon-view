import React, { createContext, useContext, useMemo } from 'react';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import DEMO_DATA from '@/data/demoData';

interface DemoDataContextType {
  isDemoMode: boolean;
  company: typeof DEMO_DATA.company | null;
  teamMembers: typeof DEMO_DATA.teamMembers;
  projects: typeof DEMO_DATA.projects;
  offices: typeof DEMO_DATA.offices;
  locations: typeof DEMO_DATA.locations;
  departments: typeof DEMO_DATA.departments;
  practiceAreas: typeof DEMO_DATA.practiceAreas;
  stages: typeof DEMO_DATA.stages;
  leaveTypes: typeof DEMO_DATA.leaveTypes;
  allocations: ReturnType<typeof DEMO_DATA.getAllocations>;
  leaveRequests: ReturnType<typeof DEMO_DATA.getLeaveRequests>;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoMode } = useDemoAuth();

  const value = useMemo(() => {
    if (!isDemoMode) {
      return {
        isDemoMode: false,
        company: null,
        teamMembers: [],
        projects: [],
        offices: [],
        locations: [],
        departments: [],
        practiceAreas: [],
        stages: [],
        leaveTypes: [],
        allocations: [],
        leaveRequests: []
      };
    }

    return {
      isDemoMode: true,
      company: DEMO_DATA.company,
      teamMembers: DEMO_DATA.teamMembers,
      projects: DEMO_DATA.projects,
      offices: DEMO_DATA.offices,
      locations: DEMO_DATA.locations,
      departments: DEMO_DATA.departments,
      practiceAreas: DEMO_DATA.practiceAreas,
      stages: DEMO_DATA.stages,
      leaveTypes: DEMO_DATA.leaveTypes,
      allocations: DEMO_DATA.getAllocations(),
      leaveRequests: DEMO_DATA.getLeaveRequests()
    };
  }, [isDemoMode]);

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (context === undefined) {
    // Return empty data if not wrapped in provider
    return {
      isDemoMode: false,
      company: null,
      teamMembers: [],
      projects: [],
      offices: [],
      locations: [],
      departments: [],
      practiceAreas: [],
      stages: [],
      leaveTypes: [],
      allocations: [],
      leaveRequests: []
    };
  }
  return context;
};

export default DemoDataContext;
