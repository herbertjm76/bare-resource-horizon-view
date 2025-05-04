
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { LeaveCalendar } from '@/components/annual-leave/LeaveCalendar';
import { MonthSelector } from '@/components/annual-leave/MonthSelector';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { Button } from '@/components/ui/button';
import { Users, Office, X } from 'lucide-react';
import '@/components/annual-leave/annual-leave.css';

const HEADER_HEIGHT = 56;

type FilterType = 'all' | 'department' | 'office';

const TeamAnnualLeave = () => {
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // State for active filters
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  
  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Fetch annual leave data
  const { leaveData, isLoading: isLoadingLeave, updateLeaveHours } = useAnnualLeave(selectedMonth);
  
  // Combine active and pre-registered members
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  
  // Handle month change
  const handleMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
  };
  
  // Handle leave hours change
  const handleLeaveChange = (memberId: string, date: string, hours: number) => {
    updateLeaveHours(memberId, date, hours);
  };
  
  // Calculate active filters count for filter button
  const activeFiltersCount = activeFilter === 'all' ? 0 : 1;
  
  // Handle filter changes
  const handleFilterChange = (type: FilterType) => {
    setActiveFilter(type === activeFilter ? 'all' : type);
    if (type === 'all') {
      setFilterValue('');
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilter('all');
    setFilterValue('');
  };
  
  const isLoading = isLoadingTeamMembers || isLoadingLeave;

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="mx-auto space-y-6">
              <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Team Annual Leave</h1>
                
                <div className="flex items-center gap-2">
                  <MonthSelector 
                    selectedMonth={selectedMonth} 
                    onMonthChange={handleMonthChange} 
                  />
                  
                  <FilterButton 
                    activeFiltersCount={activeFiltersCount}
                    onClick={() => {}} // Empty function as we're using inline filters
                  />
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <div className="bg-muted/20 p-2 rounded-md flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-medium">Filters:</div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={activeFilter === 'office' ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => handleFilterChange('office')}
                    >
                      <Office className="h-3.5 w-3.5" />
                      Office
                    </Button>
                    
                    <Button
                      variant={activeFilter === 'department' ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => handleFilterChange('department')}
                    >
                      <Users className="h-3.5 w-3.5" />
                      Department
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 ml-auto"
                    onClick={clearFilters}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
              
              <div className="border rounded-lg bg-card shadow-sm">
                {isLoading ? (
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <LeaveCalendar 
                    members={allMembers}
                    selectedMonth={selectedMonth}
                    leaveData={leaveData}
                    onLeaveChange={handleLeaveChange}
                  />
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Enter the number of leave hours for each day. Empty cells count as 0 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamAnnualLeave;
