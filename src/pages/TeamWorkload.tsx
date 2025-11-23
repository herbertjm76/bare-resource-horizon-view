import React, { useState, useMemo } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { GanttChartSquare } from 'lucide-react';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';

const TeamWorkload: React.FC = () => {
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedWeeks, setSelectedWeeks] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('all');

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, selectedWeeks));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, selectedWeeks));
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setFilterValue('all');
    setSearchQuery('');
  };

  // Extract unique departments and locations
  const departments = useMemo(() => {
    const depts = new Set(teamMembers.map(m => m.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [teamMembers]);

  const locations = useMemo(() => {
    const locs = new Set(teamMembers.map(m => m.location).filter(Boolean));
    return Array.from(locs) as string[];
  }, [teamMembers]);

  // Filter members based on active filters
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
        if (!fullName.includes(searchLower)) {
          return false;
        }
      }

      // Department/Location filter
      if (activeFilter === 'department' && filterValue !== 'all') {
        if (member.department !== filterValue) return false;
      }

      if (activeFilter === 'location' && filterValue !== 'all') {
        if (member.location !== filterValue) return false;
      }

      return true;
    });
  }, [teamMembers, searchQuery, activeFilter, filterValue]);

  const weekLabel = useMemo(
    () => `${selectedWeeks} weeks from ${startOfWeek(selectedWeek, { weekStartsOn: 1 }).toLocaleDateString()}`,
    [selectedWeek, selectedWeeks]
  );

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Team Workload"
        description="Color-coded weekly capacity overview showing utilization across weeks"
        icon={GanttChartSquare}
      />
      
      <div className="mt-6">
        <TeamWorkloadContent
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          selectedWeeks={selectedWeeks}
          onWeeksChange={setSelectedWeeks}
          isLoading={isLoadingMembers}
          filteredMembers={filteredMembers}
          departments={departments}
          locations={locations}
          activeFilter={activeFilter}
          filterValue={filterValue}
          searchQuery={searchQuery}
          setActiveFilter={setActiveFilter}
          setFilterValue={setFilterValue}
          setSearchQuery={setSearchQuery}
          clearFilters={clearFilters}
          weekLabel={weekLabel}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />
      </div>
    </StandardLayout>
  );
};

export default TeamWorkload;
