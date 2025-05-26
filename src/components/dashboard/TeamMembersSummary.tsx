
import React from 'react';
import { SummaryDashboard } from './SummaryDashboard';
import { Users, Building2, Shield, UserCheck, UserX, Calendar } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMembersSummaryProps {
  teamMembers: TeamMember[];
}

export const TeamMembersSummary: React.FC<TeamMembersSummaryProps> = ({
  teamMembers
}) => {
  // Calculate department distribution
  const departmentStats = teamMembers.reduce((acc, member) => {
    if ('isPending' in member && member.isPending) return acc; // Skip pending members for department stats
    
    const department = (member as any).department || 'Unassigned';
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate role distribution
  const roleStats = teamMembers.reduce((acc, member) => {
    if ('isPending' in member && member.isPending) {
      acc['Pending'] = (acc['Pending'] || 0) + 1;
    } else {
      const role = (member as any).role || 'member';
      const roleName = role.charAt(0).toUpperCase() + role.slice(1);
      acc[roleName] = (acc[roleName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate status breakdown
  const activeMembers = teamMembers.filter(member => !('isPending' in member && member.isPending));
  const pendingMembers = teamMembers.filter(member => 'isPending' in member && member.isPending);

  // Calculate capacity metrics
  const totalCapacity = activeMembers.reduce((sum, member) => {
    const capacity = (member as any).weekly_capacity || 40;
    return sum + capacity;
  }, 0);

  const averageCapacity = activeMembers.length > 0 ? Math.round(totalCapacity / activeMembers.length) : 0;

  // Get top department
  const topDepartment = Object.entries(departmentStats).reduce((max, [dept, count]) => 
    count > (max.count || 0) ? { name: dept, count } : max, 
    { name: 'None', count: 0 }
  );

  // Get admin count
  const adminCount = Object.entries(roleStats).reduce((sum, [role, count]) => 
    ['Admin', 'Owner'].includes(role) ? sum + count : sum, 0
  );

  const summaryMetrics = [
    {
      title: 'Total Members',
      value: teamMembers.length,
      subtitle: `${activeMembers.length} active, ${pendingMembers.length} pending`,
      progress: activeMembers.length > 0 ? Math.round((activeMembers.length / teamMembers.length) * 100) : 0,
      icon: <Users className="h-4 w-4" />,
      status: teamMembers.length > 0 ? 'good' : 'warning' as const
    },
    {
      title: 'Departments',
      value: Object.keys(departmentStats).length,
      subtitle: topDepartment.count > 0 ? `${topDepartment.name} (${topDepartment.count})` : 'No departments',
      icon: <Building2 className="h-4 w-4" />,
      status: Object.keys(departmentStats).length > 1 ? 'good' : 'info' as const
    },
    {
      title: 'Admin Users',
      value: adminCount,
      subtitle: `${Math.round((adminCount / Math.max(activeMembers.length, 1)) * 100)}% of active members`,
      icon: <Shield className="h-4 w-4" />,
      status: adminCount > 0 ? 'good' : 'warning' as const
    },
    {
      title: 'Team Capacity',
      value: `${totalCapacity}h`,
      subtitle: `${averageCapacity}h average per member`,
      icon: <Calendar className="h-4 w-4" />,
      status: totalCapacity > 0 ? 'good' : 'info' as const
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
