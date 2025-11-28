
import { User } from "@supabase/supabase-js";

export interface ResourceAllocation {
  id?: string;
  project_id: string;
  resource_id: string;
  resource_type: 'active' | 'pre_registered';
  allocation_date: string;
  hours: number;
  company_id?: string;
}

export interface UseResourceAllocationsReturn {
  allocations: Record<string, number>;
  isLoading: boolean;
  isSaving: boolean;
  saveAllocation: (weekKey: string, hours: number) => Promise<void>;
  deleteAllocation: (weekKey: string) => Promise<void>;
  refreshAllocations: () => Promise<void>;
}
