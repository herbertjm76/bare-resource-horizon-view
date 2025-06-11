
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

export const transformActiveMembers = (teamMembers: any[]) => {
  return teamMembers.map(member => ({
    id: member.id,
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
    availability: Math.round(Math.random() * 100), // Mock availability
    weekly_capacity: member.weekly_capacity || 40,
    first_name: member.first_name,
    last_name: member.last_name,
    role: member.role || 'member',
    department: member.department,
    location: member.location,
    isPending: false
  }));
};

export const combineStaffData = (activeMembers: any[], preRegisteredMembers: any[]) => {
  const transformedActiveMembers = transformActiveMembers(activeMembers);
  const transformedPreRegistered = transformPreRegisteredMembers(preRegisteredMembers);
  return [...transformedActiveMembers, ...transformedPreRegistered];
};
