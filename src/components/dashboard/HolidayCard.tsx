
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin } from 'lucide-react';
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[3px] border-[#d8d4ff] rounded-xl shadow-sm h-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 p-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-violet" />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
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
      <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[3px] border-[#d8d4ff] rounded-xl shadow-sm h-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 p-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-violet" />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
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
    <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[3px] border-[#d8d4ff] rounded-xl shadow-sm h-[400px] flex flex-col">
      <CardHeader className="flex-shrink-0 p-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-violet" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 px-6 pb-6">
            {upcomingHolidays.map((holiday) => {
              const daysUntil = getDaysUntil(holiday.date);
              
              return (
                <div key={holiday.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-brand-violet/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-brand-violet" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {holiday.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{formatDate(holiday.date)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{holiday.office}</span>
                      </div>
                    </div>
                    {daysUntil >= 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-brand-violet font-medium">
                          {daysUntil === 0 ? 'Today' : 
                           daysUntil === 1 ? 'Tomorrow' : 
                           `${daysUntil} days away`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {upcomingHolidays.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium mb-1">No Upcoming Holidays</p>
                <p className="text-xs">All clear for the next few months!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
