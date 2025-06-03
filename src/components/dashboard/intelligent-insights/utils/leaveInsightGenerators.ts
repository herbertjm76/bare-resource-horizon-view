
import { AlertTriangle, Calendar, Plane } from 'lucide-react';
import { InsightItem, TeamMember } from '../types';

interface LeaveInsights {
  nextWeekCount: number;
  nextMonthCount: number;
  peakWeek?: {
    weekStart: string;
    count: number;
  };
}

export const generateLeaveInsights = (
  leaveInsights: LeaveInsights,
  teamSize: number,
  navigate: (path: string) => void
): InsightItem[] => {
  const insights: InsightItem[] = [];

  // Annual Leave Insights (prioritized)
  if (leaveInsights.nextWeekCount > 0) {
    insights.push({
      title: "Upcoming Leave",
      description: `${leaveInsights.nextWeekCount} team members on leave next week.`,
      severity: leaveInsights.nextWeekCount > teamSize * 0.3 ? 'high' : 'medium',
      actionLabel: "View Calendar",
      onAction: () => navigate('/team-annual-leave'),
      metric: `${leaveInsights.nextWeekCount} people`,
      icon: <Plane className="h-4 w-4 text-blue-500" />
    });
  }

  if (leaveInsights.nextMonthCount > 0) {
    insights.push({
      title: "Monthly Leave",
      description: `${leaveInsights.nextMonthCount} team members on leave next month.`,
      severity: 'low',
      actionLabel: "Plan Ahead",
      onAction: () => navigate('/team-annual-leave'),
      metric: `${leaveInsights.nextMonthCount} people`,
      icon: <Calendar className="h-4 w-4 text-green-500" />
    });
  }

  if (leaveInsights.peakWeek && leaveInsights.peakWeek.count > 1) {
    insights.push({
      title: "Peak Leave Week",
      description: `Week of ${leaveInsights.peakWeek.weekStart} has ${leaveInsights.peakWeek.count} people on leave.`,
      severity: leaveInsights.peakWeek.count > teamSize * 0.4 ? 'critical' : 'medium',
      actionLabel: "Review Schedule",
      onAction: () => navigate('/team-annual-leave'),
      metric: `${leaveInsights.peakWeek.count} people`,
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />
    });
  }

  return insights;
};
