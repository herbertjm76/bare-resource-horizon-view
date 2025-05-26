
import { TeamMember } from '../types/teamSummaryTypes';

export const calculateMemberStats = (teamMembers: TeamMember[]) => {
  const activeMembers = teamMembers.filter(member => !('isPending' in member && member.isPending));
  const preRegisteredMembers = teamMembers.filter(member => 'isPending' in member && member.isPending);
  
  return {
    activeMembers,
    preRegisteredMembers,
    totalMembers: activeMembers.length + preRegisteredMembers.length
  };
};

export const calculateDepartmentStats = (activeMembers: TeamMember[]) => {
  return activeMembers.reduce((acc, member) => {
    const department = (member as any).department || 'Unassigned';
    const normalizedDept = department.toLowerCase();
    
    if (normalizedDept.includes('architecture')) {
      acc['Architecture'] = (acc['Architecture'] || 0) + 1;
    } else if (normalizedDept.includes('landscape')) {
      acc['Landscape'] = (acc['Landscape'] || 0) + 1;
    } else {
      acc['Unassigned'] = (acc['Unassigned'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
};

export const calculateLocationStats = (activeMembers: TeamMember[]) => {
  return activeMembers.reduce((acc, member) => {
    const location = (member as any).location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getLocationEmoji = (location: string) => {
  const emojiMap: Record<string, string> = {
    'US': '🇺🇸',
    'UK': '🇬🇧', 
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'BR': '🇧🇷',
    'IN': '🇮🇳',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'Unknown': '🌍'
  };
  return emojiMap[location] || '🌍';
};

export const getTopLocations = (locationStats: Record<string, number>, limit: number = 3) => {
  return Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit);
};
