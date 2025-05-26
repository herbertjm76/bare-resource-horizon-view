
import React from 'react';
import { SummaryDashboard } from './SummaryDashboard';
import { Users, Building2, MapPin } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMembersSummaryProps {
  teamMembers: TeamMember[];
}

export const TeamMembersSummary: React.FC<TeamMembersSummaryProps> = ({
  teamMembers
}) => {
  // Calculate active and preregistered members
  const activeMembers = teamMembers.filter(member => !('isPending' in member && member.isPending));
  const preRegisteredMembers = teamMembers.filter(member => 'isPending' in member && member.isPending);
  
  // Calculate department distribution for active members only
  const departmentStats = activeMembers.reduce((acc, member) => {
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

  // Calculate location distribution with emojis
  const locationStats = activeMembers.reduce((acc, member) => {
    const location = (member as any).location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get location emoji mapping
  const getLocationEmoji = (location: string) => {
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

  // Get most common location
  const topLocation = Object.entries(locationStats).reduce((max, [loc, count]) => 
    count > (max.count || 0) ? { location: loc, count } : max, 
    { location: 'Unknown', count: 0 }
  );

  // Get department summary
  const departmentSummary = Object.entries(departmentStats)
    .filter(([_, count]) => count > 0)
    .map(([dept, count]) => `${dept} (${count})`)
    .join(', ') || 'No departments assigned';

  const summaryMetrics = [
    {
      title: 'Total Members',
      value: activeMembers.length + preRegisteredMembers.length,
      subtitle: `${activeMembers.length} active, ${preRegisteredMembers.length} preregistered`,
      progress: activeMembers.length > 0 ? Math.round((activeMembers.length / (activeMembers.length + preRegisteredMembers.length)) * 100) : 0,
      icon: <Users className="h-4 w-4" />,
      status: 'good' as const
    },
    {
      title: 'Departments',
      value: Object.keys(departmentStats).length,
      subtitle: departmentSummary,
      icon: <Building2 className="h-4 w-4" />,
      status: Object.keys(departmentStats).length > 1 ? 'good' as const : 'info' as const
    },
    {
      title: 'Locations',
      value: `${getLocationEmoji(topLocation.location)} ${Object.keys(locationStats).length}`,
      subtitle: topLocation.count > 0 ? `${topLocation.location} (${topLocation.count} members)` : 'No locations',
      icon: <MapPin className="h-4 w-4" />,
      status: Object.keys(locationStats).length > 0 ? 'good' as const : 'info' as const
    }
  ];

  return (
    <SummaryDashboard 
      title="Team Overview"
      metrics={summaryMetrics}
      className="mb-6"
    />
  );
};
