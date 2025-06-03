
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth } from 'date-fns';

interface AnnualLeaveInsightsProps {
  teamMembers: TeamMember[];
  selectedMonth: Date;
}

export const AnnualLeaveInsights: React.FC<AnnualLeaveInsightsProps> = ({
  teamMembers,
  selectedMonth
}) => {
  // Helper to get user initials
  const getUserInitials = (member: TeamMember): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: TeamMember): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  // Calculate total working days in the month (excluding weekends)
  const workingDaysInMonth = getDaysInMonth(selectedMonth) * (5/7); // Rough approximation
  
  // Sample data for demonstration - in real app this would come from props or hooks
  const monthlyLeaveData = teamMembers.map(member => ({
    member,
    plannedLeaveDays: Math.floor(Math.random() * 5), // Mock data
    totalLeaveHours: Math.floor(Math.random() * 40), // Mock data
  }));

  // Find members with significant leave this month
  const membersWithLeave = monthlyLeaveData.filter(m => m.plannedLeaveDays > 0);
  
  // Find members with high leave (3+ days)
  const membersWithHighLeave = monthlyLeaveData.filter(m => m.plannedLeaveDays >= 3);

  const renderMemberAvatars = (memberList: typeof monthlyLeaveData, maxShow: number = 6) => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {membersToShow.map(({ member }) => (
            <Avatar key={member.id} className="h-6 w-6">
              <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
              <AvatarFallback className="bg-brand-violet text-white text-xs">
                {getUserInitials(member)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  const totalLeaveDays = monthlyLeaveData.reduce((sum, m) => sum + m.plannedLeaveDays, 0);
  const totalLeaveHours = monthlyLeaveData.reduce((sum, m) => sum + m.totalLeaveHours, 0);

  const metrics = [
    {
      title: "Total Leave Days",
      value: totalLeaveDays,
      subtitle: `${format(selectedMonth, 'MMMM yyyy')}`,
      badgeText: totalLeaveDays > 15 ? "High" : totalLeaveDays > 5 ? "Moderate" : "Low",
      badgeColor: (totalLeaveDays > 15 ? "red" : totalLeaveDays > 5 ? "orange" : "green") as const
    },
    {
      title: "Team Members on Leave",
      value: membersWithLeave.length > 0 ? renderMemberAvatars(membersWithLeave) : (
        <span className="text-sm text-white/80">No one on leave</span>
      ),
      subtitle: `${membersWithLeave.length} of ${teamMembers.length} members`,
      badgeText: `${membersWithLeave.length}`,
      badgeColor: (membersWithLeave.length > 5 ? "orange" : "blue") as const
    },
    {
      title: "Extended Leave",
      value: membersWithHighLeave.length > 0 ? renderMemberAvatars(membersWithHighLeave) : (
        <span className="text-sm text-white/80">No extended leave</span>
      ),
      subtitle: "3+ days this month",
      badgeText: `${membersWithHighLeave.length}`,
      badgeColor: (membersWithHighLeave.length > 0 ? "orange" : "green") as const
    },
    {
      title: "Total Leave Hours",
      value: `${totalLeaveHours}h`,
      subtitle: "This month",
      badgeText: "Tracked",
      badgeColor: "blue" as const
    }
  ];

  return (
    <StandardizedExecutiveSummary
      metrics={metrics}
      gradientType="purple"
    />
  );
};
