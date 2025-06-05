
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { HolidayCard } from '../HolidayCard';

export const MobileUpcomingEvents: React.FC = () => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="text-brand-violet font-semibold">
            Upcoming Holidays
          </span>
          <Badge variant="brand" className="bg-brand-violet/20 text-brand-violet border-brand-violet/20 ml-auto">
            5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <HolidayCard />
      </CardContent>
    </Card>
  );
};
