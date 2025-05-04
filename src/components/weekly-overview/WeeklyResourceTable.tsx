
import React from 'react';
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
      <WeeklyResourceTableContent selectedWeek={selectedWeek} filters={filters} />
    </div>
  );
};
