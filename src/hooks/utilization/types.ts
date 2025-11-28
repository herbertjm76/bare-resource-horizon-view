
export interface IndividualUtilization {
  memberId: string;
  days7: number;
  days30: number;
  days90: number;
}

export interface UtilizationPeriod {
  startDate: Date;
  periodName: string;
}

export interface MemberAllocation {
  resource_id: string;
  hours: number;
  allocation_date: string;
  project_id: string;
  resource_type: string;
}
