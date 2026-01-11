import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Activity } from 'lucide-react';
import { startOfWeek, subWeeks } from 'date-fns';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { supabase } from '@/integrations/supabase/client';
import { CapacityHeatmapContent } from '@/components/capacity/CapacityHeatmapContent';
import { logger } from '@/utils/logger';

export type HeatmapViewMode = 'actual' | 'projected' | 'gap';

const CapacityHeatmap: React.FC = () => {
  const { company } = useCompany();
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  const { preRegisteredMembers, isLoadingInvites } = useTeamMembersState(company?.id, 'member');
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedWeeks, setSelectedWeeks] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [viewMode, setViewMode] = useState<HeatmapViewMode>('actual');

  const initializedRef = useRef(false);

  // Initialize default week range to end on the latest week with any allocation
  useEffect(() => {
    const initializeWeekRange = async () => {
      if (!company?.id || initializedRef.current) return;

      try {
        // RULEBOOK: Filter by resource_type='active' for active team views
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select('allocation_date')
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .gt('hours', 0)
          .order('allocation_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching latest allocation week for capacity heatmap:', error);
          initializedRef.current = true;
          return;
        }

        if (data?.allocation_date) {
          const latestWeek = startOfWeek(new Date(data.allocation_date), { weekStartsOn: 1 });
          const startWeek = subWeeks(latestWeek, Math.max(0, selectedWeeks - 1));
          setSelectedWeek(startWeek);
        }

        initializedRef.current = true;
      } catch (err) {
        console.error('Unexpected error initializing capacity heatmap week range:', err);
        initializedRef.current = true;
      }
    };

    initializeWeekRange();
  }, [company?.id, selectedWeeks]);

  const clearFilters = () => {
    setActiveFilter('all');
    setFilterValue('all');
    setSearchQuery('');
  };

  // Combine active and pre-registered members for display
  const allMembers = useMemo(() => {
    const preRegAsTeamMembers: TeamMember[] = preRegisteredMembers.map(invite => ({
      ...invite,
      isPending: true as const,
      fullName: `${invite.first_name || 'Pre-registered'} ${invite.last_name || 'Member'}`
    }));
    
    logger.debug('📊 CAPACITY HEATMAP: Combining members', {
      activeMembers: teamMembers.length,
      preRegisteredMembers: preRegisteredMembers.length,
      total: teamMembers.length + preRegAsTeamMembers.length
    });
    
    return [...teamMembers, ...preRegAsTeamMembers];
  }, [teamMembers, preRegisteredMembers]);

  // Extract unique departments and locations from ALL members (including pre-registered)
  const departments = useMemo(() => {
    const depts = new Set(allMembers.map(m => m.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [allMembers]);

  const locations = useMemo(() => {
    const locs = new Set(allMembers.map(m => m.location).filter(Boolean));
    return Array.from(locs) as string[];
  }, [allMembers]);

  // Filter members based on active filters (for display)
  const filteredMembers = useMemo(() => {
    const filtered = allMembers.filter(member => {
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
    
    logger.debug('📊 CAPACITY HEATMAP: Filtered members', {
      allMembersCount: allMembers.length,
      filteredCount: filtered.length,
      searchQuery,
      activeFilter,
      filterValue
    });
    
    return filtered;
  }, [allMembers, searchQuery, activeFilter, filterValue]);

  const weekLabel = useMemo(
    () => `${selectedWeeks} weeks from ${startOfWeek(selectedWeek, { weekStartsOn: 1 }).toLocaleDateString()}`,
    [selectedWeek, selectedWeeks]
  );

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Capacity Heatmap"
        description="Visual overview of team capacity with actual workload, projected demand, and gap analysis"
        icon={Activity}
      />
      
      <div className="mt-6">
        <CapacityHeatmapContent
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          selectedWeeks={selectedWeeks}
          onWeeksChange={setSelectedWeeks}
          isLoading={isLoadingMembers || isLoadingInvites}
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
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>
    </StandardLayout>
  );
};

export default CapacityHeatmap;
