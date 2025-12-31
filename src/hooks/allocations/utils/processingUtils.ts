
import { MemberAllocation } from '@/components/weekly-overview/types';
import { logger } from '@/utils/logger';

interface ProjectAllocation {
  id: string;
  resource_id: string;
  hours: number;
  allocation_date: string;
  project: {
    id: string;
    name: string;
    code: string;
  } | null;
}

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Transform raw project allocations into structured member allocations
 */
export function processMemberAllocations(
  teamMembers: TeamMember[],
  projectAllocations: ProjectAllocation[]
): Record<string, MemberAllocation> {
  // Initialize allocations object
  const initialAllocations: Record<string, MemberAllocation> = {};
  
  // Process each team member
  for (const member of teamMembers) {
    // Get this member's project allocations
    const memberProjects = projectAllocations.filter(alloc => 
      alloc.resource_id === member.id
    ) || [];
    
    logger.debug(`Member ${member.id} (${member.first_name} ${member.last_name}) allocations:`, memberProjects);
    
    // Calculate total resourced hours
    const resourcedHours = memberProjects.reduce(
      (sum, project) => sum + (Number(project.hours) || 0), 
      0
    );
    
    // Get project names and detailed allocations
    const projectNames = memberProjects
      .filter(p => p.project?.name)
      .map(p => p.project!.name);
      
    // Create detailed project allocations array
    const detailedProjectAllocations = memberProjects
      .filter(p => p.project?.id && p.project?.name && p.project?.code)
      .map(p => ({
        projectName: p.project!.name,
        projectId: p.project!.id,
        projectCode: p.project!.code,
        hours: Number(p.hours) || 0
      }))
      .sort((a, b) => b.hours - a.hours); // Sort by hours descending
    
    // For demonstration, create some leave data
    // In a real app this would come from a leave table
    const annualLeave = Math.floor(Math.random() * 8);
    const vacationLeave = Math.floor(Math.random() * 8);
    const medicalLeave = Math.floor(Math.random() * 4);
    const others = Math.floor(Math.random() * 2);
    
    initialAllocations[member.id] = {
      // Original properties
      projectCount: detailedProjectAllocations.length,
      projectHours: resourcedHours,
      vacationHours: vacationLeave,
      generalOfficeHours: Math.floor(Math.random() * 5),
      marketingHours: Math.floor(Math.random() * 3),
      publicHolidayHours: Math.floor(Math.random() * 2) * 8,
      medicalLeaveHours: medicalLeave,
      annualLeaveHours: annualLeave,
      otherLeaveHours: others,
      remarks: '',
      
      // Enhanced properties
      id: member.id,
      annualLeave,
      publicHoliday: Math.floor(Math.random() * 2) * 8, // Either 0 or 8 hours
      vacationLeave,
      medicalLeave,
      others,
      projects: [...new Set(projectNames)], // Remove duplicates
      projectAllocations: detailedProjectAllocations,
      resourcedHours,
    };
  }
  
  return initialAllocations;
}
