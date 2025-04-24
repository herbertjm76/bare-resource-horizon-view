
import type { Database } from '@/integrations/supabase/types';

// Note: The DB now uses text type for current_stage instead of an enum
type DbProjectStatus = Database["public"]["Enums"]["project_status"];
export type ProjectStatus = 'In Progress' | 'Not Started' | 'Completed' | 'On Hold';

export const mapStatusToDb = (status: ProjectStatus): DbProjectStatus => {
  switch(status) {
    case 'In Progress': return 'In Progress';
    case 'Completed': return 'Complete';
    case 'On Hold': return 'On Hold';
    case 'Not Started': 
    default:
      return 'Planning';
  }
};

export const mapDbToStatus = (dbStatus: DbProjectStatus): ProjectStatus => {
  switch(dbStatus) {
    case 'In Progress': return 'In Progress';
    case 'Complete': return 'Completed';
    case 'On Hold': return 'On Hold';
    case 'Planning': 
    default:
      return 'Not Started';
  }
};

// This function is no longer needed as we're using text directly
// We'll keep it with a string return type for backward compatibility
export const mapCustomStageToDB = (stageName: string): string => {
  return stageName;
};
