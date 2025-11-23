import React, { useState, useEffect } from 'react';
import { PersonResourceGrid } from './PersonResourceGrid';
import { usePersonResourceData } from '@/hooks/usePersonResourceData';
import { useGridDays } from '../hooks/useGridDays';
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

interface PersonResourceViewProps {
  startDate: Date;
  periodToShow: number;
  displayOptions: any;
  onMonthChange: (date: Date) => void;
  onPeriodChange: (period: number) => void;
}

export const PersonResourceView: React.FC<PersonResourceViewProps> = ({
  startDate,
  periodToShow,
  displayOptions,
  onMonthChange,
  onPeriodChange
}) => {
  const { personData, isLoading, refetch } = usePersonResourceData(startDate, periodToShow);
  const days = useGridDays(startDate, periodToShow, displayOptions);
  const [expandedPeople, setExpandedPeople] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { company } = useCompany();

  // Setup real-time subscription for allocation changes to update person totals instantly
  useEffect(() => {
    if (!company?.id) return;

    console.log('🔔 Setting up real-time subscription for person totals');
    
    const channel = supabase
      .channel('person-allocations-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'project_resource_allocations',
        filter: `company_id=eq.${company.id}`
      }, (payload) => {
        console.log('🔔 Allocation changed, refreshing person totals:', payload);
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
    if (personData) {
      setExpandedPeople(personData.map(p => p.personId));
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
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' },
    { value: '16', label: '4 Months' }
  ];

  const totalPeople = personData?.length || 0;
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

  if (!personData?.length) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Compact Action Bar */}
      <div className="bg-muted/30 border border-border rounded-lg p-3">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Time navigation group */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 min-w-[90px]">
                  <Calendar className="h-3 w-3 mr-2" />
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
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Period selector */}
          <Select 
            value={periodToShow.toString()}
            onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[120px] h-8">
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

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* View controls group */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleExpand}
            className="h-8"
            disabled={totalPeople === 0}
          >
            {allExpanded ? (
              <>
                <Shrink className="h-3 w-3 mr-2" />
                Collapse
              </>
            ) : (
              <>
                <Expand className="h-3 w-3 mr-2" />
                Expand
              </>
            )}
          </Button>

          {/* Spacer to push secondary actions to the right */}
          <div className="flex-1" />

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="h-3 w-3 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content-First Main Table */}
      <div className="w-full max-w-full overflow-hidden">
        <PersonResourceGrid
          personData={personData}
          days={days}
          expandedPeople={expandedPeople}
          onTogglePersonExpand={handleTogglePersonExpand}
          selectedDate={startDate}
          periodToShow={periodToShow}
        />
      </div>
    </div>
  );
};
