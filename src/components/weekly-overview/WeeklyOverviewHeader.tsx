
import React from 'react';

export const WeeklyOverviewHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 print:hidden">
      <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Weekly Overview</h1>
    </div>
  );
};
