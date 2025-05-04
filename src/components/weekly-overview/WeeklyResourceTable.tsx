
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
  return <WeeklyResourceTableContent selectedWeek={selectedWeek} filters={filters} />;
};
