
// Define simple resource types to avoid deep instantiation issues

export interface Resource {
  id: string;
  name: string;
  role: string;
  isPending?: boolean;
}

// Simple allocation type for tracking hours per week
export type WeeklyAllocation = {
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
