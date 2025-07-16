
export const transformPreRegisteredMembers = (preRegisteredMembers: any[]) => {
  return preRegisteredMembers.map(member => ({
    id: member.id,
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Pending Member',
    first_name: member.first_name || '',
    last_name: member.last_name || '',
    availability: 0, // Pre-registered members have 0% availability
    role: member.role || 'member',
    department: member.department,
    location: member.location,
    isPending: true,
    weekly_capacity: member.weekly_capacity || 40
  }));
};

export const transformActiveMembers = (teamMembers: any[], memberUtilizations?: any[]) => {
  return teamMembers.map(member => {
    // Find real utilization data for this member
    const utilizationData = memberUtilizations?.find(util => util.memberId === member.id);
    const realUtilization = utilizationData?.utilization || 0;
    
    console.log(`🔍 TRANSFORM - ${member.first_name} ${member.last_name}:`, {
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
      weekly_capacity: member.weekly_capacity || 40,
      first_name: member.first_name,
      last_name: member.last_name,
      role: member.role || 'member',
      department: member.department,
      location: member.location,
      isPending: false
    };
  });
};

export const combineStaffData = (activeMembers: any[], preRegisteredMembers: any[], memberUtilizations?: any[]) => {
  const transformedActiveMembers = transformActiveMembers(activeMembers, memberUtilizations);
  const transformedPreRegistered = transformPreRegisteredMembers(preRegisteredMembers);
  return [...transformedActiveMembers, ...transformedPreRegistered];
};
