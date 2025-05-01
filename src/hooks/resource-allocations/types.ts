
import { supabase } from '@/integrations/supabase/client';

export interface ResourceAllocation {
  id?: string;
  project_id: string;
  resource_id: string;
  resource_type: 'active' | 'pre_registered';
  week_start_date: string;
  hours: number;
  company_id?: string;
}

export interface UseResourceAllocationsResult {
  allocations: Record<string, number>;
  isLoading: boolean;
  isSaving: boolean;
  saveAllocation: (weekKey: string, hours: number) => Promise<void>;
  deleteAllocation: (weekKey: string) => Promise<void>;
  refreshAllocations: () => Promise<void>;
}

export type ResourceAllocationChannel = ReturnType<typeof supabase.channel>;
