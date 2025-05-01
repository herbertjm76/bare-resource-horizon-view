
// Define simple resource types to avoid deep instantiation issues

export interface Resource {
  id: string;
  name: string;
  role: string;
  isPending?: boolean;
}

// Flat allocation type using composite keys
export interface ResourceAllocation {
  key: string; // Format: "resourceId:weekKey"
  resourceId: string;
  weekKey: string;
  hours: number;
}

// Define the type that AddResourceDialog expects
export interface AddResourceInput {
  staffId: string;
  name: string;
  role?: string;
  isPending?: boolean;
}
