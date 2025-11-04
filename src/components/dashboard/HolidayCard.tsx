import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin } from 'lucide-react';
import { useDashboardHolidays } from '@/hooks/queries/useDashboardQueries';
import { useCompany } from '@/context/CompanyContext';
import { StandardizedHeaderBadge } from './mobile/components/StandardizedHeaderBadge';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

interface Holiday {
  id: string;
  name: string;
  date: string;
  office: string;
  type: 'public' | 'company';
}

export const HolidayCard: React.FC = () => {
  const { company } = useCompany();
  const { data: upcomingHolidays = [], isLoading, error } = useDashboardHolidays(company?.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: '2-digit' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCountdownBadgeStyle = (daysUntil: number) => {
    if (daysUntil === 0) return { backgroundColor: 'hsl(var(--gradient-end))', color: 'white' };
    if (daysUntil === 1) return { backgroundColor: 'hsl(var(--gradient-mid))', color: 'white' };
    if (daysUntil <= 7) return { backgroundColor: 'hsl(var(--gradient-start))', color: 'white' };
    if (daysUntil <= 30) return { backgroundColor: 'hsl(var(--theme-primary))', color: 'white', opacity: '0.7' };
    return { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' };
  };

  const getCountdownText = (daysUntil: number) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil <= 7) return `${daysUntil}d`;
    if (daysUntil <= 30) return `${daysUntil}d`;
    return `${daysUntil}d`;
  };

  if (isLoading) {
    return (
      <Card className="h-[320px] flex flex-col bg-white border-border shadow-sm">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-violet/10">
              <Calendar className="h-5 w-5 text-brand-violet" />
            </div>
            <span className="font-semibold text-brand-violet">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-muted animate-pulse" />
            <p className="text-sm">Loading holidays...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !upcomingHolidays) {
    return (
      <Card className="h-[320px] flex flex-col bg-white border-border shadow-sm">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-violet/10">
              <Calendar className="h-5 w-5 text-brand-violet" />
            </div>
            <span className="font-semibold text-brand-violet">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-muted" />
            <p className="text-sm font-medium mb-1">Unable to Load Holidays</p>
            <p className="text-xs">{String(error)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[320px] flex flex-col bg-white border-border shadow-sm">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <Calendar className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="font-semibold text-brand-violet">
            Upcoming Holidays
          </span>
          {upcomingHolidays.length > 0 && (
            <StandardizedHeaderBadge>
              {upcomingHolidays.length}
            </StandardizedHeaderBadge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-1 px-4 pb-3">
            {upcomingHolidays.map((holiday) => {
              const daysUntil = getDaysUntil(holiday.date);
              const dateInfo = formatDate(holiday.date);
              
              return (
                <div key={holiday.id} className="group bg-muted/30 hover:bg-muted/50 rounded-lg p-2.5 border border-border transition-all duration-200">
                  <div className="flex items-center gap-3">
                    {/* Compact Date Display */}
                    <div className="flex-shrink-0">
                      <div className="bg-brand-violet/10 text-brand-violet rounded-md px-2 py-1.5 border border-brand-violet/20">
                        <div className="text-xs font-bold leading-none">
                          {dateInfo.day}
                        </div>
                        <div className="text-xs opacity-80 leading-none mt-0.5">
                          {dateInfo.month}
                        </div>
                      </div>
                    </div>
                    
                    {/* Holiday Information */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm leading-tight truncate">
                        {holiday.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-brand-violet" />
                        <span className="text-xs text-muted-foreground truncate">{holiday.office}</span>
                      </div>
                    </div>

                    {/* Countdown Badge using StandardizedBadge */}
                    {daysUntil >= 0 && (
                      <StandardizedBadge
                        variant="primary"
                        style={getCountdownBadgeStyle(daysUntil)}
                      >
                        {getCountdownText(daysUntil)}
                      </StandardizedBadge>
                    )}
                  </div>
                </div>
              );
            })}
            
            {upcomingHolidays.length === 0 && (
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center mb-3">
                  <Calendar className="h-8 w-8 text-brand-violet" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">No Upcoming Holidays</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    All clear for the next few months!
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
