
export interface Resource {
  id: string;
  name: string;
  role: string;
  allocations?: Record<string, number>;
  isPending?: boolean;
  isDeleted?: boolean; // True if the resource has been deleted but allocations remain
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  practice_area?: string;
  location?: string;
}

export interface AllocationRecord {
  resourceId: string;
  weekKey: string;
  hours: number;
}

// Use a flat structure with simple string keys to avoid excessive type nesting
// The key format will be `${resourceId}:${weekKey}`
export type ProjectAllocations = Record<string, number>;
