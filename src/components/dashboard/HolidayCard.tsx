
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin } from 'lucide-react';
import { useHolidays } from './hooks/useHolidays';
import { StandardizedHeaderBadge } from './mobile/components/StandardizedHeaderBadge';

interface Holiday {
  id: string;
  name: string;
  date: string;
  office: string;
  type: 'public' | 'company';
}

export const HolidayCard: React.FC = () => {
  const { holidays: upcomingHolidays, isLoading, error } = useHolidays();

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
    if (daysUntil === 0) return 'bg-red-500 text-white border-red-400';
    if (daysUntil === 1) return 'bg-orange-500 text-white border-orange-400';
    if (daysUntil <= 7) return 'bg-yellow-500 text-white border-yellow-400';
    if (daysUntil <= 30) return 'bg-blue-500 text-white border-blue-400';
    return 'bg-gray-500 text-white border-gray-400';
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
      <Card className="h-[320px] flex flex-col bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg flex items-center gap-3">
            <Calendar className="h-4 w-4 text-brand-violet" strokeWidth={1.5} />
            <span className="text-brand-violet font-semibold">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-300 animate-pulse" strokeWidth={1.5} />
            <p className="text-sm">Loading holidays...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[320px] flex flex-col bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg flex items-center gap-3">
            <Calendar className="h-4 w-4 text-brand-violet" strokeWidth={1.5} />
            <span className="text-brand-violet font-semibold">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm font-medium mb-1">Unable to Load Holidays</p>
            <p className="text-xs">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[320px] flex flex-col bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-3">
          <Calendar className="h-4 w-4 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">
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
                <div key={holiday.id} className="group bg-white/70 hover:bg-white/90 rounded-lg p-2 border border-gray-100/50 hover:border-gray-200/80 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    {/* Compact Date Display */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-brand-violet to-purple-600 text-white rounded-md px-1.5 py-1">
                        <div className="text-xs font-bold leading-none">
                          {dateInfo.day}
                        </div>
                        <div className="text-xs opacity-90 leading-none mt-0.5">
                          {dateInfo.month}
                        </div>
                      </div>
                    </div>
                    
                    {/* Holiday Information */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight truncate group-hover:text-brand-violet transition-colors">
                        {holiday.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-brand-violet" strokeWidth={1.5} />
                        <span className="text-xs text-gray-600 truncate">{holiday.office}</span>
                      </div>
                    </div>

                    {/* Countdown Badge */}
                    {daysUntil >= 0 && (
                      <div className={`ml-auto bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full ${getCountdownBadgeStyle(daysUntil)}`}>
                        {getCountdownText(daysUntil)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {upcomingHolidays.length === 0 && (
              <div className="text-center py-6">
                <div className="p-3 rounded-full bg-brand-violet/10 mx-auto w-12 h-12 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-brand-violet" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 text-sm">No Upcoming Holidays</h3>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                    All clear for the next few months! Your team can focus on upcoming projects.
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
