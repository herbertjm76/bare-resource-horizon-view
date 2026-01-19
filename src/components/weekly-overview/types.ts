
export interface Project {
  id: string;
  code: string;
  name: string;
  abbreviation?: string | null;
  color?: string;
}

export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

export interface MemberAllocation {
  // Original properties
  projectCount: number;
  projectHours: number;
  vacationHours: number;
  generalOfficeHours: number;
  marketingHours: number;
  publicHolidayHours: number;
  medicalLeaveHours: number;
  annualLeaveHours: number;
  otherLeaveHours: number;
  remarks: string;
  
  // Enhanced properties used in components
  id?: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  projects: string[];
  projectAllocations: ProjectAllocation[];
  resourcedHours: number;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string;
  avatar_url?: string;
}
