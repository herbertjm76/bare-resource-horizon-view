
export interface Project {
  id: string;
  code: string;
  name: string;
  color?: string;
}

export interface MemberAllocation {
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
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string;
  avatar_url?: string;
}
