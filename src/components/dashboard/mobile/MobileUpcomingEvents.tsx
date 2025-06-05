
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { HolidayCard } from '../HolidayCard';
import { StandardizedHeaderBadge } from './components/StandardizedHeaderBadge';

export const MobileUpcomingEvents: React.FC = () => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <Calendar className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">
            Upcoming Holidays
          </span>
          <StandardizedHeaderBadge>
            5
          </StandardizedHeaderBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {/* Hide the header of HolidayCard to prevent duplication */}
        <div className="[&_.card]:border-0 [&_.card]:shadow-none [&_.card]:bg-transparent [&_h3]:hidden [&_.flex.items-center.gap-3]:hidden">
          <HolidayCard />
        </div>
      </CardContent>
    </Card>
  );
};
