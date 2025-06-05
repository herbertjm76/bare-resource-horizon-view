
import React from 'react';

interface StandardizedHeaderBadgeProps {
  children: React.ReactNode;
}

export const StandardizedHeaderBadge: React.FC<StandardizedHeaderBadgeProps> = ({ children }) => {
  return (
    <div className="ml-auto bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
      {children}
    </div>
  );
};
</StandardizedHeaderBadge>

<lov-write file_path="src/components/dashboard/mobile/MobileUpcomingEvents.tsx">
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
        <HolidayCard />
      </CardContent>
    </Card>
  );
};
