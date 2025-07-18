
import React from 'react';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface DashboardHeaderProps {
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (range: TimeRange) => void;
  officeOptions: Array<{ value: string; label: string }>;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedOffice,
  setSelectedOffice,
  selectedTimeRange,
  setSelectedTimeRange,
  officeOptions
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Week
              </Button>
              <Button variant="default" size="sm" className="bg-brand-primary">
                Month
              </Button>
              <Button variant="outline" size="sm">
                Quarter
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <TimeRangeSelector
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
            />
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
