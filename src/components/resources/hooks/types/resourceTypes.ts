
// Define simple resource types to avoid deep instantiation issues

export interface Resource {
  id: string;
  name: string;
  role: string;
  isPending?: boolean;
}

// Simple definition for allocation records
export interface AllocationRecord {
  resourceId: string;
  weekKey: string;
  hours: number;
}

// Simple map of week key to hours
export type AllocationsByWeek = Record<string, number>;

// Define the type that AddResourceDialog expects
export interface AddResourceInput {
  staffId: string;
  name: string;
  role?: string;
  isPending?: boolean;
}
