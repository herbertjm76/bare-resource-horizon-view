
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { HolidayCard } from '../HolidayCard';

export const MobileUpcomingEvents: React.FC = () => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <HolidayCard />
      </CardContent>
    </Card>
  );
};
