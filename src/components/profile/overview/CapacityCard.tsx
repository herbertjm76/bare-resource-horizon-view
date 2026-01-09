
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { formatCapacityValue, formatAllocationValue } from '@/utils/allocationDisplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, format } from 'date-fns';

interface CapacityCardProps {
  profile: any;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ profile }) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  const weeklyCapacity = getMemberCapacity(profile.weekly_capacity, workWeekHours);
  const isUsingDefault = profile.weekly_capacity === null || profile.weekly_capacity === undefined;

  // Calculate date ranges
  const now = new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const quarterStart = format(startOfQuarter(now), 'yyyy-MM-dd');
  const quarterEnd = format(endOfQuarter(now), 'yyyy-MM-dd');

  // Fetch allocation data for this week, month, and quarter
  const { data: allocations, isLoading } = useQuery({
    queryKey: ['profile-capacity-allocations', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('hours, allocation_date')
        .eq('resource_id', profile.id)
        .eq('resource_type', 'team_member')
        .gte('allocation_date', quarterStart)
        .lte('allocation_date', quarterEnd);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile.id,
  });

  // Calculate hours for each period
  const weekHours = allocations?.filter(a => 
    a.allocation_date >= weekStart && a.allocation_date <= weekEnd
  ).reduce((sum, a) => sum + (a.hours || 0), 0) || 0;

  const monthHours = allocations?.filter(a => 
    a.allocation_date >= monthStart && a.allocation_date <= monthEnd
  ).reduce((sum, a) => sum + (a.hours || 0), 0) || 0;

  const quarterHours = allocations?.reduce((sum, a) => sum + (a.hours || 0), 0) || 0;

  // Calculate capacity for each period
  const weeksInMonth = 4;
  const weeksInQuarter = 13;
  const monthCapacity = weeklyCapacity * weeksInMonth;
  const quarterCapacity = weeklyCapacity * weeksInQuarter;

  // Calculate percentages (capped at 100% for display)
  const weekPercent = weeklyCapacity > 0 ? Math.min((weekHours / weeklyCapacity) * 100, 100) : 0;
  const monthPercent = monthCapacity > 0 ? Math.min((monthHours / monthCapacity) * 100, 100) : 0;
  const quarterPercent = quarterCapacity > 0 ? Math.min((quarterHours / quarterCapacity) * 100, 100) : 0;

  // Get bar color based on utilization
  const getBarColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 70) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  return (
    <Card className="bg-card border-2 border-border rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Capacity</h3>
        
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Weekly Capacity</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-foreground">{formatCapacityValue(weeklyCapacity, displayPreference)}</p>
              {isUsingDefault && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  Company Default
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className={`${getBarColor(weekPercent)} h-1.5 rounded-full transition-all`} 
                    style={{ width: `${weekPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium min-w-[32px] text-right">
                  {isLoading ? '...' : formatAllocationValue(Math.round(weekHours), weeklyCapacity, displayPreference)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className={`${getBarColor(monthPercent)} h-1.5 rounded-full transition-all`} 
                    style={{ width: `${monthPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium min-w-[32px] text-right">
                  {isLoading ? '...' : formatAllocationValue(Math.round(monthHours), monthCapacity, displayPreference)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">This Quarter</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className={`${getBarColor(quarterPercent)} h-1.5 rounded-full transition-all`} 
                    style={{ width: `${quarterPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium min-w-[32px] text-right">
                  {isLoading ? '...' : formatAllocationValue(Math.round(quarterHours), quarterCapacity, displayPreference)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
