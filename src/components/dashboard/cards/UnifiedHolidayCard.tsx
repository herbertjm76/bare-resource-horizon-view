
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { HolidayCard } from '../HolidayCard';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { useHolidays } from '../hooks/useHolidays';

export const UnifiedHolidayCard: React.FC = () => {
  const { holidays, isLoading } = useHolidays();

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
        <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Upcoming Events
          </h2>
          <div className="space-y-4 flex-1">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="p-1 rounded bg-gray-200 animate-pulse">
                  <div className="h-4 w-4"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Upcoming Events
          </h2>
          <StandardizedHeaderBadge>
            {holidays?.length || 0} Events
          </StandardizedHeaderBadge>
        </div>
        
        {/* Original HolidayCard content */}
        <div className="flex-1 overflow-hidden [&_.card]:border-0 [&_.card]:shadow-none [&_.card]:bg-transparent [&_h3]:hidden [&_.flex.items-center.gap-3]:hidden">
          <HolidayCard />
        </div>
      </CardContent>
    </Card>
  );
};
