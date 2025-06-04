
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { HolidayCard } from '../HolidayCard';

export const MobileUpcomingEvents: React.FC = () => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-lg flex-shrink-0">
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
          <span className="truncate font-medium">Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <HolidayCard />
      </CardContent>
    </Card>
  );
};
