
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/components/dashboard/types';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';
import { format, getDaysInMonth, startOfWeek, endOfWeek, addWeeks, eachWeekOfInterval, differenceInDays, addDays, isSameDay } from 'date-fns';

interface AnnualLeaveInsightsProps {
  teamMembers: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
}

export const AnnualLeaveInsights: React.FC<AnnualLeaveInsightsProps> = ({
  teamMembers,
  selectedMonth,
  leaveData
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

  // Calculate standardized team utilization for annual leave
  const teamUtilization = UtilizationCalculationService.calculateAnnualLeaveUtilization(
    teamMembers,
    selectedMonth,
    leaveData
  );

  // Calculate people on leave this month
  const calculatePeopleOnLeaveThisMonth = () => {
    const membersOnLeave = teamMembers.filter(member => {
      const memberLeaveData = leaveData[member.id] || {};
      return Object.values(memberLeaveData).some(hours => hours > 0);
    });
    return membersOnLeave;
  };

  // Calculate peak leave period (week with most people on leave)
  const calculatePeakLeavePeriod = () => {
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    const weeks = eachWeekOfInterval({
      start: monthStart,
      end: monthEnd
    }, { weekStartsOn: 1 });
    
    let peakWeek = null;
    let maxCount = 0;
    
    weeks.forEach(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const peopleOnLeaveThisWeek = new Set();
      
      teamMembers.forEach(member => {
        const memberLeaveData = leaveData[member.id] || {};
        Object.entries(memberLeaveData).forEach(([date, hours]) => {
          if (hours > 0) {
            const leaveDate = new Date(date);
            if (leaveDate >= weekStart && leaveDate <= weekEnd) {
              peopleOnLeaveThisWeek.add(member.id);
            }
          }
        });
      });
      
      if (peopleOnLeaveThisWeek.size > maxCount) {
        maxCount = peopleOnLeaveThisWeek.size;
        peakWeek = {
          weekStart: format(weekStart, 'MMM d'),
          count: peopleOnLeaveThisWeek.size
        };
      }
    });
    
    return peakWeek;
  };

  // Calculate upcoming leave alerts (next week)
  const calculateUpcomingLeaveAlerts = () => {
    const today = new Date();
    const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
    
    const peopleOnLeaveNextWeek = new Set();
    
    teamMembers.forEach(member => {
      const memberLeaveData = leaveData[member.id] || {};
      Object.entries(memberLeaveData).forEach(([date, hours]) => {
        if (hours > 0) {
          const leaveDate = new Date(date);
          if (leaveDate >= nextWeekStart && leaveDate <= nextWeekEnd) {
            peopleOnLeaveNextWeek.add(member.id);
          }
        }
      });
    });
    
    return peopleOnLeaveNextWeek.size;
  };

  // Calculate average leave block size
  const calculateAverageLeaveBlockSize = () => {
    const allLeaveBlocks: number[] = [];
    
    teamMembers.forEach(member => {
      const memberLeaveData = leaveData[member.id] || {};
      const leaveDates = Object.entries(memberLeaveData)
        .filter(([_, hours]) => hours > 0)
        .map(([date, _]) => new Date(date))
        .sort((a, b) => a.getTime() - b.getTime());
      
      if (leaveDates.length === 0) return;
      
      // Group consecutive dates into blocks
      let currentBlockSize = 1;
      
      for (let i = 1; i < leaveDates.length; i++) {
        const prevDate = leaveDates[i - 1];
        const currentDate = leaveDates[i];
        const daysDiff = differenceInDays(currentDate, prevDate);
        
        if (daysDiff === 1) {
          // Consecutive day
          currentBlockSize++;
        } else {
          // Gap found, save current block and start new one
          allLeaveBlocks.push(currentBlockSize);
          currentBlockSize = 1;
        }
      }
      
      // Don't forget the last block
      allLeaveBlocks.push(currentBlockSize);
    });
    
    if (allLeaveBlocks.length === 0) return 0;
    
    const averageBlockSize = allLeaveBlocks.reduce((sum, size) => sum + size, 0) / allLeaveBlocks.length;
    return Math.round(averageBlockSize * 10) / 10; // Round to 1 decimal place
  };

  const renderMemberAvatars = (memberList: TeamMember[], maxShow: number = 6): React.ReactElement => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {membersToShow.map((member) => (
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

  // Calculate all metrics using standardized calculations
  const peopleOnLeaveThisMonth = calculatePeopleOnLeaveThisMonth();
  const peakLeavePeriod = calculatePeakLeavePeriod();
  const upcomingLeaveCount = calculateUpcomingLeaveAlerts();
  const averageBlockSize = calculateAverageLeaveBlockSize();

  const metrics = [
    {
      title: "People on Leave",
      value: peopleOnLeaveThisMonth.length > 0 ? renderMemberAvatars(peopleOnLeaveThisMonth) : "No one on leave",
      subtitle: `${peopleOnLeaveThisMonth.length} of ${teamMembers.length} team members`,
      badgeText: `${peopleOnLeaveThisMonth.length} of ${teamMembers.length}`,
      badgeColor: (peopleOnLeaveThisMonth.length > 5 ? "orange" : "blue") as 'green' | 'blue' | 'purple' | 'red' | 'orange'
    },
    {
      title: "Team Capacity Impact",
      value: `${teamUtilization.teamUtilizationRate}%`,
      subtitle: `${teamUtilization.totalAvailableHours}h available capacity`,
      badgeText: UtilizationCalculationService.getUtilizationBadgeText(teamUtilization.teamUtilizationRate),
      badgeColor: UtilizationCalculationService.getUtilizationColor(teamUtilization.teamUtilizationRate) as 'green' | 'blue' | 'purple' | 'red' | 'orange'
    },
    {
      title: "Upcoming Leave Alerts",
      value: upcomingLeaveCount > 0 ? `${upcomingLeaveCount} people` : "No upcoming leave",
      subtitle: "Next week impact",
      badgeText: upcomingLeaveCount > 3 ? "High Impact" : upcomingLeaveCount > 1 ? "Medium Impact" : "Low Impact",
      badgeColor: (upcomingLeaveCount > 3 ? "red" : upcomingLeaveCount > 1 ? "orange" : "green") as 'green' | 'blue' | 'purple' | 'red' | 'orange'
    },
    {
      title: "Average Leave Block",
      value: averageBlockSize > 0 ? `${averageBlockSize} days` : "No data",
      subtitle: "Typical leave duration",
      badgeText: `${averageBlockSize} days average`,
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
