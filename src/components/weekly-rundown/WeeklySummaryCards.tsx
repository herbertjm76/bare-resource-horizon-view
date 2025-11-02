import React, { useRef, useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HolidaysCard } from './cards/HolidaysCard';
import { AnnualLeaveCard } from './cards/AnnualLeaveCard';
import { OtherLeaveCard } from './cards/OtherLeaveCard';
import { NotesCard } from './cards/NotesCard';
import { AvailableThisWeekCard } from './cards/AvailableThisWeekCard';
import { CustomRundownCard } from './cards/CustomRundownCard';
import { WeekInfoCard } from './cards/WeekInfoCard';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { useCardVisibility, CardVisibility } from '@/hooks/useCardVisibility';

interface WeeklySummaryCardsProps {
  selectedWeek: Date;
  memberIds: string[];
  cardVisibility: CardVisibility;
}

export const WeeklySummaryCards: React.FC<WeeklySummaryCardsProps> = ({
  selectedWeek,
  memberIds,
  cardVisibility
}) => {
  const { company } = useCompany();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartString = format(weekStart, 'yyyy-MM-dd');
  const weekEndString = format(weekEnd, 'yyyy-MM-dd');

  // Fetch annual leaves
  const { data: annualLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-leaves', weekStartString, weekEndString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch office holidays for the selected week from office_holidays (office settings)
  const { data: holidays = [] } = useQuery({
    queryKey: ['weekly-summary-holidays', weekStartString, weekEndString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('office_holidays')
        .select('id, date, name, end_date')
        .eq('company_id', company.id)
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch weekly other leave
  const { data: otherLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-other-leaves', weekStartString, memberIds, company?.id],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return [];

      const { data, error } = await supabase
        .from('weekly_other_leave')
        .select('member_id, hours, leave_type, notes')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartString)
        .in('member_id', memberIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch weekly notes
  const { data: weeklyNotes = [] } = useQuery({
    queryKey: ['weekly-notes', weekStartString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('weekly_notes')
        .select('id, start_date, end_date, description')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartString)
        .order('start_date');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch custom card types
  const { data: customCardTypes = [] } = useCustomCardTypes();

  // Build card registry based on visibility
  const cards = useMemo(() => {
    const visibleCards = [];

    // Always show WeekInfoCard first
    visibleCards.push({ id: 'weekInfo', component: <WeekInfoCard key="weekInfo" selectedWeek={selectedWeek} /> });

    if (cardVisibility.holidays) {
      visibleCards.push({ id: 'holidays', component: <HolidaysCard key="holidays" holidays={holidays} /> });
    }
    if (cardVisibility.annualLeave) {
      visibleCards.push({ id: 'annualLeave', component: <AnnualLeaveCard key="annualLeave" leaves={annualLeaves} /> });
    }
    if (cardVisibility.otherLeave) {
      visibleCards.push({ id: 'otherLeave', component: <OtherLeaveCard key="otherLeave" leaves={otherLeaves} /> });
    }
    if (cardVisibility.notes) {
      visibleCards.push({ id: 'notes', component: <NotesCard key="notes" notes={weeklyNotes} weekStartDate={weekStartString} /> });
    }
    if (cardVisibility.available) {
      visibleCards.push({ 
        id: 'available', 
        component: <AvailableThisWeekCard key="available" weekStartDate={weekStartString} threshold={80} /> 
      });
    }

    // Add custom cards (show by default if not explicitly set to false)
    customCardTypes.forEach(cardType => {
      const cardKey = `custom_${cardType.id}`;
      // Show if explicitly true OR if undefined (default to visible)
      const isVisible = cardVisibility[cardKey] !== false;
      if (isVisible) {
        visibleCards.push({
          id: cardKey,
          component: (
            <CustomRundownCard
              key={cardKey}
              cardType={cardType}
              weekStartDate={weekStartString}
            />
          )
        });
      }
    });

    return visibleCards;
  }, [selectedWeek, cardVisibility, holidays, annualLeaves, otherLeaves, weeklyNotes, weekStartString, customCardTypes]);

  // Handle scroll and show/hide arrows
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    handleScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [cards]);

  // Don't return null as we always want to show the WeekInfoCard

  return (
    <div className="relative group mb-6">
      {/* Left Arrow */}
      {showLeftArrow && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-lg"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 pb-2 scrollbar-hide px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map(card => (
          <div key={card.id} className="flex-shrink-0 min-w-fit h-[180px] snap-center">
            {card.component}
          </div>
        ))}
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-lg"
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
