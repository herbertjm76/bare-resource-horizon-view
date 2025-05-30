
import React from 'react';
import { Button } from '@/components/ui/button';

interface WeeklyOverviewHeaderProps {
  summaryFormat: 'simple' | 'detailed';
  setSummaryFormat: (format: 'simple' | 'detailed') => void;
}

export const WeeklyOverviewHeader: React.FC<WeeklyOverviewHeaderProps> = ({
  summaryFormat,
  setSummaryFormat
}) => {
  const handleSimpleClick = () => {
    console.log('Simple Cards button clicked');
    setSummaryFormat('simple');
  };

  const handleDetailedClick = () => {
    console.log('Detailed Cards button clicked');
    setSummaryFormat('detailed');
  };

  console.log('WeeklyOverviewHeader render:', { summaryFormat });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 print:hidden">
      <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Weekly Overview</h1>
      <div className="flex gap-2">
        <Button
          variant={summaryFormat === 'simple' ? 'default' : 'outline'}
          size="sm"
          onClick={handleSimpleClick}
        >
          Simple Cards
        </Button>
        <Button
          variant={summaryFormat === 'detailed' ? 'default' : 'outline'}
          size="sm"
          onClick={handleDetailedClick}
        >
          Detailed Cards
        </Button>
      </div>
    </div>
  );
};
