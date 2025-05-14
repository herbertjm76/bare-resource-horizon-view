
export interface Project {
  id: string;
  code: string;
  name: string;
}

export interface MemberAllocation {
  id: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  remarks: string;
  projects: string[];
  resourcedHours: number;
  projectAllocations: Array<{
    projectName: string;
    projectId: string;
    hours: number;
    projectCode: string;
  }>;
}
