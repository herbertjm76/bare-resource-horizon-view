
import { Dispatch, SetStateAction } from 'react';

export interface ResourceAllocation {
  id?: string;
  project_id: string;
  resource_id: string;
  resource_type: 'active' | 'pre_registered';
  week_start_date: string;
  hours: number;
  company_id?: string;
}

export type ResourceAllocationsMap = Record<string, number>;

export interface ResourceAllocationsState {
  allocations: ResourceAllocationsMap;
  isLoading: boolean;
  isSaving: boolean;
  saveAllocation: (weekKey: string, hours: number) => Promise<void>;
  deleteAllocation: (weekKey: string) => Promise<void>;
  refreshAllocations: () => Promise<void>;
}
