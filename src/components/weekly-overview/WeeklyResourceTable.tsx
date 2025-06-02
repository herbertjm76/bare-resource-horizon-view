
import React from 'react';
import { WeeklyResourceTableWrapper } from './components/WeeklyResourceTableWrapper';
import './css/index.css';

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
    <WeeklyResourceTableWrapper 
      selectedWeek={selectedWeek} 
      filters={filters}
    />
  );
};
