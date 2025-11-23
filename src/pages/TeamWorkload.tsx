
import React, { useState, useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Briefcase } from 'lucide-react';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { startOfWeek, format } from 'date-fns';

const TeamWorkload: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [filters, setFilters] = useState({
    office: "all",
    searchTerm: ""
  });

  const handleWeekChange = useCallback((date: Date) => {
    setSelectedWeek(date);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const weekLabel = useMemo(
    () => format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'MMM d, yyyy'),
    [selectedWeek]
  );

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Team Workload"
        description="Weekly capacity overview showing each team member's total hours"
        icon={Briefcase}
      />
      
      <div className="mt-6">
        <WeekResourceView
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          onWeekChange={handleWeekChange}
          weekLabel={weekLabel}
          filters={filters}
          onFilterChange={handleFilterChange}
          tableOrientation="per-person"
        />
      </div>
    </StandardLayout>
  );
};

export default TeamWorkload;
