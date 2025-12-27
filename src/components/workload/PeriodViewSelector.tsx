
import React from 'react';
import { Button } from '@/components/ui/button';

export type PeriodView = 'month' | 'quarter' | 'year';

interface PeriodViewSelectorProps {
  selectedView: PeriodView;
  onViewChange: (view: PeriodView) => void;
}

export const PeriodViewSelector: React.FC<PeriodViewSelectorProps> = ({
  selectedView,
  onViewChange
}) => {
  const views = [
    { key: 'month' as const, label: 'This Month' },
    { key: 'quarter' as const, label: 'This Quarter' },
    { key: 'year' as const, label: 'This Year' }
  ];

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      {views.map(({ key, label }) => (
        <Button
          key={key}
          variant={selectedView === key ? "default" : "ghost"}
          size="sm"
          className={`h-8 px-4 ${
            selectedView === key 
              ? "bg-theme-primary text-white shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          }`}
          onClick={() => onViewChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
