
import React, { createContext, useContext } from 'react';
import { useOptimizedDashboardData } from './hooks/useOptimizedDashboardData';
import { UnifiedDashboardData } from './hooks/types/dashboardTypes';
import { TimeRange } from './TimeRangeSelector';

interface UnifiedDashboardContextType extends UnifiedDashboardData {
  setSelectedOffice: (office: string) => void;
  refetch: () => Promise<void>;
}

const UnifiedDashboardContext = createContext<UnifiedDashboardContextType | undefined>(undefined);

interface UnifiedDashboardProviderProps {
  children: React.ReactNode;
  selectedTimeRange: TimeRange;
}

export const UnifiedDashboardProvider: React.FC<UnifiedDashboardProviderProps> = ({
  children,
  selectedTimeRange
}) => {
  const dashboardData = useOptimizedDashboardData(selectedTimeRange);

  return (
    <UnifiedDashboardContext.Provider value={dashboardData}>
      {children}
    </UnifiedDashboardContext.Provider>
  );
};

export const useUnifiedDashboardData = () => {
  const context = useContext(UnifiedDashboardContext);
  if (context === undefined) {
    throw new Error('useUnifiedDashboardData must be used within a UnifiedDashboardProvider');
  }
  return context;
};
