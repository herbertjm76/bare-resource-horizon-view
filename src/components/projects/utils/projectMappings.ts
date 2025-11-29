
import type { Database } from '@/integrations/supabase/types';

// Note: The DB now uses text type for current_stage instead of an enum
type DbProjectStatus = Database["public"]["Enums"]["project_status"];
export type ProjectStatus = "In Progress" | "Planning" | "On Hold" | "Complete";

// Define type for project stage as string since we removed the enum
export type ProjectStage = string;

export const mapStatusToDb = (status: string): DbProjectStatus => {
  switch(status) {
    case 'Active':
    case 'In Progress':
      return 'In Progress';
    case 'Completed': 
    case 'Complete':
      return 'Complete';
    case 'On Hold':
      return 'On Hold';
    case 'Planning':
      return 'Planning';
    default:
      // Fallback to a non-planning state so we never accidentally set everything to "Planning"
      return 'In Progress';
  }
};

export const mapDbToStatus = (dbStatus: DbProjectStatus): ProjectStatus => {
  switch(dbStatus) {
    case 'In Progress':
      return 'In Progress';
    case 'Complete':
      return 'Complete';
    case 'On Hold':
      return 'On Hold';
    case 'Planning': 
    default:
      // Treat unknown statuses as in progress instead of "Planning"
      return 'In Progress';
  }
};

// This function is no longer needed as we're using text directly
export const mapCustomStageToDB = (stageName: string): string => {
  return stageName;
};
