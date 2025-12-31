import React, { useState, useEffect, useMemo } from 'react';
import { PersonResourceGrid } from './PersonResourceGrid';
import { usePersonResourceData } from '@/hooks/usePersonResourceData';
import { useGridWeeks } from '../hooks/useGridWeeks';
import { GridLoadingState } from '../grid/GridLoadingState';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter, Expand, Shrink, Download, Settings } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { MobilePersonControls } from './MobilePersonControls';
import { logger } from '@/utils/logger';

interface MemberFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

interface PersonResourceViewProps {
  startDate: Date;
  periodToShow: number;
  displayOptions: any;
  onMonthChange: (date: Date) => void;
  onPeriodChange: (period: number) => void;
  showOnlyControls?: boolean;
  showOnlyGrid?: boolean;
  memberFilters?: MemberFilters;
}

export const PersonResourceView: React.FC<PersonResourceViewProps> = ({
  startDate,
  periodToShow,
  displayOptions,
  onMonthChange,
  onPeriodChange,
  showOnlyControls = false,
  showOnlyGrid = false,
  memberFilters
}) => {
  const { personData, isLoading, refetch } = usePersonResourceData(startDate, periodToShow);
  const weeks = useGridWeeks(startDate, periodToShow, displayOptions);
  const [expandedPeople, setExpandedPeople] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { company } = useCompany();

  // Filter person data based on member filters
  const filteredPersonData = useMemo(() => {
    if (!personData || !memberFilters) return personData;
    
    return personData.filter(person => {
      if (memberFilters.practiceArea && memberFilters.practiceArea !== 'all') {
        if (person.practiceArea !== memberFilters.practiceArea) return false;
      }
      if (memberFilters.department && memberFilters.department !== 'all') {
        if (person.department !== memberFilters.department) return false;
      }
      if (memberFilters.location && memberFilters.location !== 'all') {
        if (person.location !== memberFilters.location) return false;
      }
      if (memberFilters.searchTerm) {
        const searchLower = memberFilters.searchTerm.toLowerCase();
        const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
        if (!fullName.includes(searchLower)) return false;
      }
      return true;
    });
  }, [personData, memberFilters]);

  // Setup real-time subscription for allocation changes to update person totals instantly
  useEffect(() => {
    if (!company?.id) return;

    logger.log('🔔 Setting up real-time subscription for person totals');
    
    const channel = supabase
      .channel('person-allocations-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'project_resource_allocations',
        filter: `company_id=eq.${company.id}`
      }, (payload) => {
        logger.log('🔔 Allocation changed, refreshing person totals:', payload);
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [company?.id, refetch]);

  const handleTogglePersonExpand = (personId: string) => {
    setExpandedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const expandAll = () => {
    if (filteredPersonData) {
      setExpandedPeople(filteredPersonData.map(p => p.personId));
    }
  };

  const collapseAll = () => {
    setExpandedPeople([]);
  };

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(startDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(startDate, 1));
  };

  const monthLabel = format(startDate, 'MMM yyyy');

  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' },
    { value: '16', label: '4 Months' }
  ];

  const totalPeople = filteredPersonData?.length || 0;
  const allExpanded = expandedPeople.length === totalPeople && totalPeople > 0;
  
  const handleToggleExpand = () => {
    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  if (isLoading) {
    return <GridLoadingState />;
  }

  if (!filteredPersonData?.length) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found.</p>
      </div>
    );
  }

  // Render only controls if requested
  if (showOnlyControls) {
    return (
      <>
        {/* Mobile Controls */}
        <MobilePersonControls
          startDate={startDate}
          onMonthChange={onMonthChange}
          periodToShow={periodToShow}
          onPeriodChange={onPeriodChange}
          allExpanded={allExpanded}
          onToggleExpand={handleToggleExpand}
          totalPeople={totalPeople}
        />
        
        {/* Desktop Controls */}
        <div className="hidden lg:block px-2 pt-2">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            
            {/* Left section - Date Navigation */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousMonth}
                  className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 min-w-[90px] bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
                      {monthLabel}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          const startOfSelectedMonth = startOfMonth(date);
                          onMonthChange(startOfSelectedMonth);
                          setCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextMonth}
                  className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Right section - Controls */}
            <div className="flex gap-2 items-center ml-auto overflow-x-auto">
              {/* Period selector */}
              <Select 
                value={periodToShow.toString()}
                onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
              >
                <SelectTrigger className="w-28 h-7 text-xs bg-muted border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Expand/Collapse */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleExpand}
                className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
                disabled={totalPeople === 0}
              >
                {allExpanded ? (
                  <Shrink className="h-3.5 w-3.5" />
                ) : (
                  <Expand className="h-3.5 w-3.5" />
                )}
              </Button>

              {/* Export */}
              <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
                <Download className="h-3.5 w-3.5" />
              </Button>
              
              {/* Settings */}
              <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render only grid if requested
  if (showOnlyGrid) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1400px] overflow-hidden">
          <PersonResourceGrid
            personData={filteredPersonData}
            weeks={weeks}
            expandedPeople={expandedPeople}
            onTogglePersonExpand={handleTogglePersonExpand}
            selectedDate={startDate}
            periodToShow={periodToShow}
            onRefresh={refetch}
          />
        </div>
      </div>
    );
  }

  // Default: render both
  return (
    <div className="space-y-3">
      {/* Mobile Controls */}
      <MobilePersonControls
        startDate={startDate}
        onMonthChange={onMonthChange}
        periodToShow={periodToShow}
        onPeriodChange={onPeriodChange}
        allExpanded={allExpanded}
        onToggleExpand={handleToggleExpand}
        totalPeople={totalPeople}
      />
      
      {/* Centered main grid */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1400px] overflow-hidden">
          <PersonResourceGrid
            personData={filteredPersonData}
            weeks={weeks}
            expandedPeople={expandedPeople}
            onTogglePersonExpand={handleTogglePersonExpand}
            selectedDate={startDate}
            periodToShow={periodToShow}
            onRefresh={refetch}
          />
        </div>
      </div>
      
      {/* Desktop Compact Action Bar */}
      <div className="hidden lg:block bg-card rounded-lg border p-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          
          {/* Left section - Date Navigation */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousMonth}
                className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 min-w-[90px] bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
                    {monthLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        const startOfSelectedMonth = startOfMonth(date);
                        onMonthChange(startOfSelectedMonth);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Right section - Controls */}
          <div className="flex gap-2 items-center ml-auto overflow-x-auto">
            {/* Period selector */}
            <Select 
              value={periodToShow.toString()}
              onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-28 h-7 text-xs bg-muted border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Expand/Collapse */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleExpand}
              className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
              disabled={totalPeople === 0}
            >
              {allExpanded ? (
                <Shrink className="h-3.5 w-3.5" />
              ) : (
                <Expand className="h-3.5 w-3.5" />
              )}
            </Button>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
              <Download className="h-3.5 w-3.5" />
            </Button>
            
            {/* Settings */}
            <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
