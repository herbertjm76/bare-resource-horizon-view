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
import { CustomRundownCard } from './cards/CustomRundownCard';
import { WeekInfoCard } from './cards/WeekInfoCard';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { CardVisibility, CardOrder } from '@/hooks/useCardVisibility';
import { Settings, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ManageCustomCardsDialog } from './ManageCustomCardsDialog';
import './css/weekly-cards-scroll.css';

interface WeeklySummaryCardsProps {
  selectedWeek: Date;
  memberIds: string[];
  cardVisibility: CardVisibility;
  cardOrder: CardOrder;
  toggleCard: (key: string, isVisible: boolean) => void;
  moveCard: (cardId: string, direction: 'up' | 'down') => void;
  reorderCards: (newOrder: CardOrder) => void;
}

export const WeeklySummaryCards: React.FC<WeeklySummaryCardsProps> = ({
  selectedWeek,
  memberIds,
  cardVisibility,
  cardOrder,
  toggleCard,
  moveCard,
  reorderCards
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
    const allCards = [];

    console.log('Building cards with visibility:', cardVisibility);

    // Build all available cards
    allCards.push({ 
      id: 'weekInfo', 
      component: <WeekInfoCard key="weekInfo" selectedWeek={selectedWeek} />,
      isVisible: true // WeekInfoCard is always visible
    });

    allCards.push({ 
      id: 'holidays', 
      component: <HolidaysCard key="holidays" holidays={holidays} />,
      isVisible: cardVisibility.holidays 
    });
    
    allCards.push({ 
      id: 'annualLeave', 
      component: <AnnualLeaveCard key="annualLeave" leaves={annualLeaves} />,
      isVisible: cardVisibility.annualLeave 
    });
    
    allCards.push({ 
      id: 'otherLeave', 
      component: <OtherLeaveCard key="otherLeave" leaves={otherLeaves} />,
      isVisible: cardVisibility.otherLeave 
    });
    
    allCards.push({ 
      id: 'notes', 
      component: <NotesCard key="notes" notes={weeklyNotes} weekStartDate={weekStartString} />,
      isVisible: cardVisibility.notes 
    });

    // Add custom cards
    customCardTypes.forEach(cardType => {
      const cardKey = `custom_${cardType.id}`;
      const isVisible = cardVisibility[cardKey] !== false;
      console.log(`Custom card ${cardType.label} (${cardKey}): visibility=${cardVisibility[cardKey]}, isVisible=${isVisible}`);
      
      allCards.push({
        id: cardKey,
        component: (
          <CustomRundownCard
            key={cardKey}
            cardType={cardType}
            weekStartDate={weekStartString}
          />
        ),
        isVisible
      });
    });

    // Filter visible cards
    const visibleCards = allCards.filter(card => card.isVisible);
    const visibleCardIds = visibleCards.map(c => c.id);
    
    // Sort by cardOrder if available, ensuring all visible cards are in the order
    if (cardOrder.length > 0) {
      // Filter out cards that are no longer visible
      const validOrderedIds = cardOrder.filter(id => visibleCardIds.includes(id));
      
      // Add any new cards that aren't in the order yet
      const newCardIds = visibleCardIds.filter(id => !validOrderedIds.includes(id));
      const completeOrder = [...validOrderedIds, ...newCardIds];
      
      visibleCards.sort((a, b) => {
        const indexA = completeOrder.indexOf(a.id);
        const indexB = completeOrder.indexOf(b.id);
        return indexA - indexB;
      });
    }

    return visibleCards;
  }, [selectedWeek, cardVisibility, cardOrder, holidays, annualLeaves, otherLeaves, weeklyNotes, weekStartString, customCardTypes, toggleCard]);

  // Helper: move a card by computing order from currently rendered cards
  const handleMove = (cardId: string, direction: 'left' | 'right') => {
    const currentOrder = cards.map(c => c.id);
    const index = currentOrder.indexOf(cardId);
    if (index === -1) return;
    const minIndex = cards[0]?.id === 'weekInfo' ? 1 : 0; // keep WeekInfo pinned first
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < minIndex || targetIndex >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    reorderCards(newOrder);
  };

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
    <div className="mb-6 relative px-2 sm:px-4 py-3 border rounded-lg bg-gradient-to-br from-card to-accent/20 overflow-hidden weekly-cards-container">
      {/* Cards Container */}
      <div className="relative group pr-12 sm:pr-20">
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
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 weekly-cards-scroll"
        >
          {cards.map((card, index) => (
            <div key={card.id} className="relative flex-shrink-0 min-w-fit h-[180px] snap-center group/card">
              {card.component}
              
              {/* Reorder buttons - show on hover, except for WeekInfoCard */}
              {card.id !== 'weekInfo' && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 shadow-lg"
                    onClick={() => handleMove(card.id, 'left')}
                    disabled={index === 0 || (index === 1 && cards[0].id === 'weekInfo')}
                    title="Move left"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 shadow-lg"
                    onClick={() => handleMove(card.id, 'right')}
                    disabled={index === cards.length - 1}
                    title="Move right"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
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

      {/* Controls - TOP RIGHT ALIGNED */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-20 weekly-summary-controls">
        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 shadow-lg">
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
            <DropdownMenuLabel>Visible Cards</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.holidays} 
              onCheckedChange={(v) => toggleCard('holidays', v)}
            >
              Holidays
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.annualLeave} 
              onCheckedChange={(v) => toggleCard('annualLeave', v)}
            >
              Annual Leave
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.otherLeave} 
              onCheckedChange={(v) => toggleCard('otherLeave', v)}
            >
              Other Leave
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.notes} 
              onCheckedChange={(v) => toggleCard('notes', v)}
            >
              Notes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.available} 
              onCheckedChange={(v) => toggleCard('available', v)}
            >
              Available This Week
            </DropdownMenuCheckboxItem>
            
            {customCardTypes.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Custom Cards</DropdownMenuLabel>
                {customCardTypes.map(card => (
                  <DropdownMenuCheckboxItem 
                    key={card.id}
                    checked={cardVisibility[`custom_${card.id}`] !== false}
                    onCheckedChange={(v) => toggleCard(`custom_${card.id}`, v)}
                  >
                    {card.icon && <span className="mr-2">{card.icon}</span>}
                    {card.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Card Button */}
        <ManageCustomCardsDialog iconOnly />
      </div>
    </div>
  );
};
