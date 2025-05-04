
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeeklyResourceTableContent } from './components/WeeklyResourceTableContent';

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <ScrollArea className="h-[calc(100vh-320px)]">
        <WeeklyResourceTableContent selectedWeek={selectedWeek} filters={filters} />
      </ScrollArea>
    </div>
  );
};
