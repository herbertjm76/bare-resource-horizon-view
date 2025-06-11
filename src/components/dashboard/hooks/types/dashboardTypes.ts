
export interface UnifiedDashboardData {
  // Team data
  teamMembers: any[];
  preRegisteredMembers: any[];
  transformedStaffData: any[];
  totalTeamSize: number; // Include pre-registered in total count
  
  // Project data
  projects: any[];
  activeProjects: number;
  
  // Utilization data
  currentUtilizationRate: number;
  utilizationStatus: {
    status: string;
    color: string;
    textColor: string;
  };
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  
  // Holiday data
  holidays: any[];
  isHolidaysLoading: boolean;
  
  // Smart insights data
  smartInsightsData: {
    teamMembers: any[];
    activeProjects: number;
    utilizationRate: number;
    totalTeamSize: number; // Include total team size for insights
  };
  
  // Office data
  selectedOffice: string;
  officeOptions: string[];
  
  // Meta data
  isLoading: boolean;
  metrics: any;
  mockData: any;
  activeResources: number;
}

export interface UtilizationStatusData {
  status: string;
  color: string;
  textColor: string;
}
