import { logger } from '@/utils/logger';

export const transformPreRegisteredMembers = (
  preRegisteredMembers: any[],
  memberUtilizations?: any[],
  workWeekHours: number = 40
) => {
  return preRegisteredMembers.map(member => {
    // Find real utilization data for this pending member
    const utilizationData = memberUtilizations?.find(util => util.memberId === member.id);
    const realUtilization = utilizationData?.utilization || 0;
    
    logger.debug(`TRANSFORM PENDING - ${member.first_name} ${member.last_name}:`, {
      memberId: member.id,
      realUtilization,
      utilizationData
    });
    
    return {
      id: member.id,
      name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Pending Member',
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      availability: realUtilization, // Use REAL utilization instead of hardcoded 0
      utilization: realUtilization, // Also add as utilization for consistency
      role: member.role || 'member',
      department: member.department,
      location: member.location,
      isPending: true,
      weekly_capacity: member.weekly_capacity || workWeekHours
    };
  });
};

export const transformActiveMembers = (
  teamMembers: any[],
  memberUtilizations?: any[],
  workWeekHours: number = 40
) => {
  return teamMembers.map(member => {
    // Find real utilization data for this member
    const utilizationData = memberUtilizations?.find(util => util.memberId === member.id);
    const realUtilization = utilizationData?.utilization || 0;
    
    logger.debug(`TRANSFORM - ${member.first_name} ${member.last_name}:`, {
      memberId: member.id,
      realUtilization,
      utilizationData
    });
    
    return {
      id: member.id,
      name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
      fullName: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
      availability: realUtilization, // Use REAL utilization instead of mock data
      utilization: realUtilization, // Also add as utilization for consistency
      weekly_capacity: member.weekly_capacity || workWeekHours,
      first_name: member.first_name,
      last_name: member.last_name,
      role: member.role || 'member',
      department: member.department,
      location: member.location,
      isPending: false
    };
  });
};

export const combineStaffData = (
  activeMembers: any[],
  preRegisteredMembers: any[],
  memberUtilizations?: any[],
  workWeekHours: number = 40
) => {
  const transformedActiveMembers = transformActiveMembers(activeMembers, memberUtilizations, workWeekHours);
  const transformedPreRegistered = transformPreRegisteredMembers(preRegisteredMembers, memberUtilizations, workWeekHours);
  
  logger.debug('COMBINE STAFF DATA:', {
    activeMembers: transformedActiveMembers.length,
    preRegisteredMembers: transformedPreRegistered.length,
    totalCombined: transformedActiveMembers.length + transformedPreRegistered.length,
    activeUtilizations: transformedActiveMembers.map(m => `${m.name}: ${m.utilization}%`),
    pendingMembers: transformedPreRegistered.map(m => `${m.name}: ${m.availability}%`)
  });
  
  return [...transformedActiveMembers, ...transformedPreRegistered];
};
