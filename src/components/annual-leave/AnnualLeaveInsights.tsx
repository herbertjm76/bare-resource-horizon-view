
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useAnnualLeaveInsights } from '@/hooks/useAnnualLeaveInsights';
import { TeamMember } from '@/components/dashboard/types';

interface AnnualLeaveInsightsProps {
  teamMembers: TeamMember[];
  selectedMonth: Date;
  summaryFormat?: 'simple' | 'detailed';
}

export const AnnualLeaveInsights: React.FC<AnnualLeaveInsightsProps> = ({
  teamMembers,
  selectedMonth,
  summaryFormat = 'simple'
}) => {
  const { insights, isLoading } = useAnnualLeaveInsights(teamMembers);

  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 border border-brand-violet/10 shadow-lg bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const timeRangeText = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const metrics = [
    {
      title: "Next Week",
      value: insights.nextWeekCount,
      subtitle: insights.nextWeekCount === 1 ? 'person on leave' : 'people on leave',
      badgeText: insights.nextWeekCount > teamMembers.length * 0.3 ? 'High Impact' : 'Manageable',
      badgeColor: insights.nextWeekCount > teamMembers.length * 0.3 ? 'orange' : 'blue'
    },
    {
      title: "Next Month",
      value: insights.nextMonthCount,
      subtitle: insights.nextMonthCount === 1 ? 'person scheduled' : 'people scheduled',
      badgeText: "Plan Ahead",
      badgeColor: "green"
    },
    {
      title: "Peak Week",
      value: insights.peakWeek ? insights.peakWeek.count : 0,
      subtitle: insights.peakWeek ? `Week of ${insights.peakWeek.weekStart}` : 'No peak identified',
      badgeText: insights.peakWeek 
        ? (insights.peakWeek.count > teamMembers.length * 0.4 ? 'Critical' : 'Monitor')
        : 'Balanced',
      badgeColor: insights.peakWeek 
        ? (insights.peakWeek.count > teamMembers.length * 0.4 ? 'red' : 'orange')
        : 'green'
    },
    {
      title: "Team Coverage",
      value: `${Math.round((1 - (insights.nextWeekCount / teamMembers.length)) * 100)}%`,
      subtitle: "Available next week",
      badgeText: insights.nextWeekCount / teamMembers.length > 0.5 ? 'Low Coverage' :
                 insights.nextWeekCount / teamMembers.length > 0.3 ? 'Moderate' : 'Good Coverage',
      badgeColor: insights.nextWeekCount / teamMembers.length > 0.5 ? 'red' :
                  insights.nextWeekCount / teamMembers.length > 0.3 ? 'orange' : 'green'
    }
  ];

  return (
    <StandardizedExecutiveSummary
      title="Annual Leave Overview"
      timeRangeText={`${timeRangeText} insights and upcoming leave planning`}
      metrics={metrics}
      gradientType="purple"
      cardFormat={summaryFormat}
    />
  );
};
