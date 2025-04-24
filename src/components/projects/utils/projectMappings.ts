import type { Database } from '@/integrations/supabase/types';

type DbProjectStage = Database["public"]["Enums"]["project_stage"];
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

export const mapCustomStageToDB = (stageName: string): DbProjectStage => {
  // First check if the stage name is already a valid DB enum value
  const validStages: DbProjectStage[] = ['BD', 'SD', 'DD', 'CD', 'CMP'];
  if (validStages.includes(stageName as DbProjectStage)) {
    return stageName as DbProjectStage;
  }
  
  // Otherwise, try to map based on name
  const lowerName = stageName.toLowerCase();
  if (lowerName.includes('bd') || lowerName.includes('business development')) return 'BD';
  if (lowerName.includes('sd') || lowerName.includes('schematic design')) return 'SD';
  if (lowerName.includes('dd') || lowerName.includes('design development')) return 'DD';
  if (lowerName.includes('cd') || lowerName.includes('construction document')) return 'CD';
  if (lowerName.includes('cmp') || lowerName.includes('complete')) return 'CMP';
  
  // Default to BD if no match is found
  console.log(`No stage mapping found for "${stageName}", defaulting to BD`);
  return 'BD';
};
