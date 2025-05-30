
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useAnnualLeaveInsights } from '@/hooks/useAnnualLeaveInsights';
import { TeamMember } from '@/components/dashboard/types';
import { Calendar, Users, AlertTriangle, Shield } from 'lucide-react';

interface AnnualLeaveInsightsProps {
  teamMembers: TeamMember[];
  selectedMonth: Date;
  summaryFormat?: 'simple' | 'detailed';
}

export const AnnualLeaveInsights: React.FC<AnnualLeaveInsightsProps> = ({
  teamMembers,
  selectedMonth,
  summaryFormat = 'detailed'
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
      icon: Calendar,
      badgeText: insights.nextWeekCount > teamMembers.length * 0.3 ? 'High Impact' : 'Manageable',
      badgeColor: insights.nextWeekCount > teamMembers.length * 0.3 ? 'orange' : 'blue',
      breakdowns: [
        { label: 'Annual Leave', value: Math.round(insights.nextWeekCount * 0.7), color: 'blue' },
        { label: 'Sick Leave', value: Math.round(insights.nextWeekCount * 0.2), color: 'orange' },
        { label: 'Other', value: Math.round(insights.nextWeekCount * 0.1), color: 'red' }
      ]
    },
    {
      title: "Next Month",
      value: insights.nextMonthCount,
      subtitle: insights.nextMonthCount === 1 ? 'person scheduled' : 'people scheduled',
      icon: Users,
      badgeText: "Plan Ahead",
      badgeColor: "green",
      breakdowns: [
        { label: 'Week 1', value: Math.round(insights.nextMonthCount * 0.3), color: 'green' },
        { label: 'Week 2', value: Math.round(insights.nextMonthCount * 0.2), color: 'blue' },
        { label: 'Week 3+', value: Math.round(insights.nextMonthCount * 0.5), color: 'orange' }
      ]
    },
    {
      title: "Peak Week",
      value: insights.peakWeek ? insights.peakWeek.count : 0,
      subtitle: insights.peakWeek ? `Week of ${insights.peakWeek.weekStart}` : 'No peak identified',
      icon: AlertTriangle,
      badgeText: insights.peakWeek 
        ? (insights.peakWeek.count > teamMembers.length * 0.4 ? 'Critical' : 'Monitor')
        : 'Balanced',
      badgeColor: insights.peakWeek 
        ? (insights.peakWeek.count > teamMembers.length * 0.4 ? 'red' : 'orange')
        : 'green',
      breakdowns: insights.peakWeek ? [
        { label: 'Critical Days', value: Math.round(insights.peakWeek.count * 0.6), color: 'red' },
        { label: 'Moderate Days', value: Math.round(insights.peakWeek.count * 0.4), color: 'orange' }
      ] : [
        { label: 'Balanced', value: teamMembers.length, color: 'green' }
      ]
    },
    {
      title: "Team Coverage",
      value: `${Math.round((1 - (insights.nextWeekCount / teamMembers.length)) * 100)}%`,
      subtitle: "Available next week",
      icon: Shield,
      badgeText: insights.nextWeekCount / teamMembers.length > 0.5 ? 'Low Coverage' :
                 insights.nextWeekCount / teamMembers.length > 0.3 ? 'Moderate' : 'Good Coverage',
      badgeColor: insights.nextWeekCount / teamMembers.length > 0.5 ? 'red' :
                  insights.nextWeekCount / teamMembers.length > 0.3 ? 'orange' : 'green',
      breakdowns: [
        { label: 'Available', value: teamMembers.length - insights.nextWeekCount, color: 'green' },
        { label: 'On Leave', value: insights.nextWeekCount, color: 'red' }
      ]
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
