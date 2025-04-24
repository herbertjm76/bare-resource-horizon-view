
import type { Database } from '@/integrations/supabase/types';

// Note: The DB now uses text type for current_stage instead of an enum
type DbProjectStatus = Database["public"]["Enums"]["project_status"];
export type ProjectStatus = 'In Progress' | 'Not Started' | 'Completed' | 'On Hold';

// Define type for project stage that allows both enum values and string
export type ProjectStage = Database["public"]["Enums"]["project_stage"] | string;

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

// This function is for backward compatibility and type safety
// It ensures the stage name is properly typed for the database
export const mapCustomStageToDB = (stageName: string): ProjectStage => {
  return stageName as ProjectStage;
};
