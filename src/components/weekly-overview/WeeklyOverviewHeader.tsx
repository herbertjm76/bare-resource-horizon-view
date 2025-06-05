
import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeeklyOverviewHeaderProps {
  selectedWeek: Date;
}

export const WeeklyOverviewHeader: React.FC<WeeklyOverviewHeaderProps> = ({
  selectedWeek
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = format(weekStart, 'MMMM d, yyyy');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-first header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-brand-violet flex-shrink-0" />
              <span className="break-words">Weekly Overview</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Resource allocation for the week of {weekLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-optimized stats cards - ONE ROW on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
        <Card className="p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="p-1 sm:p-2 bg-blue-500 rounded-lg w-fit mx-auto sm:mx-0">
              <Users className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-blue-700 font-medium truncate">Team Resources</p>
              <p className="text-xs sm:text-base font-bold text-blue-900">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-2 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="p-1 sm:p-2 bg-green-500 rounded-lg w-fit mx-auto sm:mx-0">
              <TrendingUp className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-green-700 font-medium truncate">Utilization</p>
              <p className="text-xs sm:text-base font-bold text-green-900">Optimal</p>
            </div>
          </div>
        </Card>

        <Card className="p-2 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="p-1 sm:p-2 bg-purple-500 rounded-lg w-fit mx-auto sm:mx-0">
              <Calendar className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-purple-700 font-medium truncate">Planning</p>
              <p className="text-xs sm:text-base font-bold text-purple-900">Current Week</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
