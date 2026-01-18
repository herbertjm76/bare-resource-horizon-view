import React from 'react';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { WeekViewSelector } from '@/components/workload/components/WeekViewSelector';

interface CapacityHeatmapControlsProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  selectedWeeks: number;
  onWeeksChange: (weeks: number) => void;
}

export const CapacityHeatmapControls: React.FC<CapacityHeatmapControlsProps> = ({
  selectedWeek,
  onWeekChange,
  selectedWeeks,
  onWeeksChange
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <WeekStartSelector
        selectedWeek={selectedWeek}
        onWeekChange={onWeekChange}
      />
      
      <WeekViewSelector
        selectedWeeks={selectedWeeks}
        onWeeksChange={onWeeksChange}
      />
    </div>
  );
};