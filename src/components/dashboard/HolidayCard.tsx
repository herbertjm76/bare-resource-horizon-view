
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useHolidays } from './hooks/useHolidays';

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

  const getUrgencyStyle = (daysUntil: number) => {
    if (daysUntil === 0) return 'bg-red-500 text-white';
    if (daysUntil === 1) return 'bg-orange-500 text-white';
    if (daysUntil <= 7) return 'bg-yellow-500 text-white';
    if (daysUntil <= 30) return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getUrgencyText = (daysUntil: number) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil <= 7) return `${daysUntil} days`;
    if (daysUntil <= 30) return `${daysUntil} days`;
    return `${daysUntil} days`;
  };

  if (isLoading) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300 animate-pulse" />
            <p className="text-sm">Loading holidays...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
              Upcoming Holidays
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium mb-1">Unable to Load Holidays</p>
            <p className="text-xs">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-blue-200/50">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
            Upcoming Holidays
          </span>
          {upcomingHolidays.length > 0 && (
            <Badge variant="outline" className="bg-white/80 text-blue-700 border-blue-200">
              {upcomingHolidays.length} Coming Up
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 px-6 pb-6">
            {upcomingHolidays.map((holiday) => {
              const daysUntil = getDaysUntil(holiday.date);
              const dateInfo = formatDate(holiday.date);
              
              return (
                <div key={holiday.id} className="group bg-white/70 hover:bg-white/90 rounded-xl p-4 border border-blue-100/50 hover:border-blue-200/80 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    {/* Prominent Date Display */}
                    <div className="flex-shrink-0">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg p-3 shadow-md">
                          <div className="text-xs font-medium opacity-90 mb-1">
                            {dateInfo.month.toUpperCase()}
                          </div>
                          <div className="text-xl font-bold leading-none">
                            {dateInfo.day}
                          </div>
                          <div className="text-xs font-medium opacity-90 mt-1">
                            {dateInfo.weekday}
                          </div>
                        </div>
                        {daysUntil >= 0 && (
                          <div className={`mt-2 px-2 py-1 rounded-md text-xs font-medium ${getUrgencyStyle(daysUntil)}`}>
                            {getUrgencyText(daysUntil)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Holiday Information */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                          {holiday.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="truncate">{holiday.office}</span>
                        </div>
                        {holiday.type === 'company' && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                            Company
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {upcomingHolidays.length === 0 && (
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-blue-100 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">No Upcoming Holidays</h3>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
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
