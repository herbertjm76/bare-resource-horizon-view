
export interface Resource {
  id: string;
  name: string;
  role: string;
  allocations?: Record<string, number>;
  isPending?: boolean;
}

export interface AllocationRecord {
  resourceId: string;
  weekKey: string;
  hours: number;
}

// Simpler definition of allocations by week without circular references
export type AllocationsByWeek = Record<string, number>;

// Define the type that AddResourceDialog expects
export interface AddResourceInput {
  staffId: string;
  name: string;
  role?: string;
  isPending?: boolean;
}
