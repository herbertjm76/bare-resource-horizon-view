
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

// Define the allocation structure without circular references
export type AllocationsByWeek = Record<string, number>;
export type ProjectAllocations = Record<string, AllocationsByWeek>;

// Define the type that AddResourceDialog expects
export interface AddResourceInput {
  staffId: string;
  name: string;
  role?: string;
  isPending?: boolean;
}
