
import { TeamMember } from '../types';

export const calculateTeamMembersMetrics = (teamMembers: TeamMember[]) => {
  const totalMembers = teamMembers.length;
  
  // Count active vs pending members
  const activeMembers = teamMembers.filter(member => !('isPending' in member) || !member.isPending).length;
  const pendingMembers = teamMembers.filter(member => 'isPending' in member && member.isPending).length;
  
  // Get unique departments (only for active members with department info)
  const departments = new Set<string>();
  teamMembers.forEach(member => {
    if ('department' in member && member.department && (!('isPending' in member) || !member.isPending)) {
      departments.add(member.department);
    }
  });
  
  // Get unique locations (only for active members with location info)
  const locations = new Set<string>();
  teamMembers.forEach(member => {
    if ('location' in member && member.location && (!('isPending' in member) || !member.isPending)) {
      locations.add(member.location);
    }
  });
  
  return {
    totalMembers,
    activeMembers,
    pendingMembers,
    departments: departments.size,
    locations: locations.size
  };
};
