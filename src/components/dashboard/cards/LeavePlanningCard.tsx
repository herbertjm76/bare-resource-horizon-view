import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, AlertTriangle, Users } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';
import { format, isWithinInterval, addDays, startOfMonth, endOfMonth, addWeeks, addMonths } from 'date-fns';

interface LeavePlanningCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange: TimeRange;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const LeavePlanningCard: React.FC<LeavePlanningCardProps> = ({ data, selectedTimeRange }) => {
  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'Next 3 Months';
      case '4months': return 'Next 4 Months';
      case '6months': return 'Next 6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };
  const currentDate = new Date();
  
  // Calculate time range end date based on selected time range
  const getTimeRangeEnd = () => {
    switch (selectedTimeRange) {
      case 'week':
        return addWeeks(currentDate, 1);
      case 'month':
        return addMonths(currentDate, 1);
      case '3months':
        return addMonths(currentDate, 3);
      case '4months':
        return addMonths(currentDate, 4);
      case '6months':
        return addMonths(currentDate, 6);
      case 'year':
        return addMonths(currentDate, 12);
      default:
        return addMonths(currentDate, 1);
    }
  };

  const timeRangeEnd = getTimeRangeEnd();

  // Filter holidays within the selected time range
  const upcomingHolidays = data.holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return isWithinInterval(holidayDate, { start: currentDate, end: timeRangeEnd });
  });

  // Calculate impact based on team size and holiday type
  const calculateImpact = (holiday: any) => {
    const teamSize = data.totalTeamSize;
    if (teamSize <= 5) return 'high';
    if (teamSize <= 15) return 'medium';
    return 'low';
  };

  // Group holidays by week
  const weeklyHolidays = upcomingHolidays.reduce((acc, holiday) => {
    const weekStart = new Date(holiday.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push({
      ...holiday,
      impact: calculateImpact(holiday)
    });
    return acc;
  }, {} as Record<string, any[]>);

  const totalLeaveDays = upcomingHolidays.length;
  const highImpactDays = upcomingHolidays.filter(h => calculateImpact(h) === 'high').length;

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2" style={{ color: 'hsl(var(--theme-primary))' }}>
            <div className="p-1.5 rounded-lg bg-gradient-modern">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <span>Leave Planning</span>
              <div className="text-xs text-muted-foreground">{getTimeRangeLabel()}</div>
            </div>
          </h2>
          <StandardizedHeaderBadge>
            {upcomingHolidays.length} Events
          </StandardizedHeaderBadge>
        </div>

        <div className="flex-1 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Leave Days</span>
              </div>
              <span className="text-xl font-bold text-blue-900">{totalLeaveDays}</span>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">High Impact</span>
              </div>
              <span className="text-xl font-bold text-red-900">{highImpactDays}</span>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Holidays</h3>
            <div className="space-y-2">
              {upcomingHolidays.length > 0 ? (
                upcomingHolidays
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((holiday, index) => {
                    const impact = calculateImpact(holiday);
                    return (
                      <div
                        key={index}
                        className="p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{holiday.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getImpactColor(impact)}`}>
                            {impact} impact
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>{format(new Date(holiday.date), 'MMM d, yyyy')}</span>
                          {holiday.end_date && (
                            <span>- {format(new Date(holiday.end_date), 'MMM d')}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No upcoming holidays</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Impact Summary */}
          {totalLeaveDays > 0 && (
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="h-3 w-3" />
                <span>
                  Impact calculated based on {data.totalTeamSize} team members
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};