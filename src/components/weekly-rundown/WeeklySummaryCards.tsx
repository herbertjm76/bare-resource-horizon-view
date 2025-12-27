import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { HolidaysCard } from './cards/HolidaysCard';
import { LeaveCard } from './cards/LeaveCard';
import { OtherLeaveCard } from './cards/OtherLeaveCard';
import { NotesCard } from './cards/NotesCard';
import { AnnouncementsCard } from './cards/AnnouncementsCard';
import { CustomRundownCard } from './cards/CustomRundownCard';
import { WeekInfoCard } from './cards/WeekInfoCard';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { CardVisibility, CardOrder } from '@/hooks/useCardVisibility';
import { Settings, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ManageCustomCardsDialog } from './ManageCustomCardsDialog';
import { useSwipeable } from 'react-swipeable';
import './css/weekly-cards-scroll.css';

interface WeeklySummaryCardsProps {
  selectedWeek: Date;
  memberIds: string[];
  cardVisibility: CardVisibility;
  cardOrder: CardOrder;
  toggleCard: (key: string, isVisible: boolean) => void;
  moveCard: (cardId: string, direction: 'up' | 'down') => void;
  reorderCards: (newOrder: CardOrder) => void;
  // Optional pre-fetched data to avoid duplicate queries
  annualLeaves?: any[];
  holidays?: any[];
  otherLeaves?: any[];
  weeklyNotes?: any[];
  customCardTypes?: any[];
}

export const WeeklySummaryCards: React.FC<WeeklySummaryCardsProps> = ({
  selectedWeek,
  memberIds,
  cardVisibility,
  cardOrder,
  toggleCard,
  moveCard,
  reorderCards,
  annualLeaves: prefetchedAnnualLeaves,
  holidays: prefetchedHolidays,
  otherLeaves: prefetchedOtherLeaves,
  weeklyNotes: prefetchedWeeklyNotes,
  customCardTypes: prefetchedCustomCardTypes
}) => {
  const { company } = useCompany();
  const scrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('weekly-summary-collapsed');
    return saved === 'true';
  });
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartString = format(weekStart, 'yyyy-MM-dd');
  const weekEndString = format(weekEnd, 'yyyy-MM-dd');

  // Fetch annual leaves if not provided
  const { data: fetchedAnnualLeaves = [] } = useQuery({
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
    enabled: !!company?.id && !prefetchedAnnualLeaves,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Fetch holidays if not provided
  const { data: fetchedHolidays = [] } = useQuery({
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
    enabled: !!company?.id && !prefetchedHolidays,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Fetch other leaves if not provided
  const { data: fetchedOtherLeaves = [] } = useQuery({
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
    enabled: !!company?.id && memberIds.length > 0 && !prefetchedOtherLeaves,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Fetch weekly notes if not provided
  const { data: fetchedWeeklyNotes = [] } = useQuery({
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
    enabled: !!company?.id && !prefetchedWeeklyNotes,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Fetch custom card types if not provided
  const { data: fetchedCustomCardTypes = [] } = useCustomCardTypes();

  const annualLeaves = prefetchedAnnualLeaves || fetchedAnnualLeaves;
  const holidays = prefetchedHolidays || fetchedHolidays;
  const otherLeaves = prefetchedOtherLeaves || fetchedOtherLeaves;
  const weeklyNotes = prefetchedWeeklyNotes || fetchedWeeklyNotes;
  const customCardTypes = prefetchedCustomCardTypes || fetchedCustomCardTypes;

  // Build card registry based on visibility
  const cards = useMemo(() => {
    const allCards = [];

    // Build all available cards
    allCards.push({ 
      id: 'weekInfo', 
      component: <WeekInfoCard key="weekInfo" selectedWeek={selectedWeek} />,
      isVisible: true // WeekInfoCard is always visible
    });

    allCards.push({ 
      id: 'announcements', 
      component: <AnnouncementsCard key="announcements" weekStartDate={weekStartString} />,
      isVisible: cardVisibility.announcements !== false // Default to visible
    });

    allCards.push({ 
      id: 'holidays', 
      component: <HolidaysCard key="holidays" holidays={holidays} />,
      isVisible: cardVisibility.holidays 
    });
    
    allCards.push({ 
      id: 'annualLeave', 
      component: <LeaveCard key="annualLeave" leaves={annualLeaves} />,
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

  // Carousel navigation
  const goToCard = (index: number) => {
    if (index >= 0 && index < cards.length) {
      setCurrentCardIndex(index);
    }
  };

  const goToNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Reset carousel index when cards change
  useEffect(() => {
    if (currentCardIndex >= cards.length && cards.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [cards.length, currentCardIndex]);

  // Check scroll position for desktop/tablet arrows
  const checkScrollPosition = useCallback(() => {
    const container = desktopScrollRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const container = desktopScrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, cards]);

  const scrollDesktop = (direction: 'left' | 'right') => {
    const container = desktopScrollRef.current;
    if (!container) return;
    
    const scrollAmount = 300;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const scrollToCardById = (cardId: string) => {
    const container = desktopScrollRef.current;
    if (!container) return;
    
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const cardElements = container.children;
    if (cardElements[cardIndex]) {
      (cardElements[cardIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

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

  // Don't return null as we always want to show the WeekInfoCard

  const currentCard = cards[currentCardIndex];
  const canGoPrev = currentCardIndex > 0;
  const canGoNext = currentCardIndex < cards.length - 1;

  // Get card label for menu
  const getCardLabel = (cardId: string) => {
    if (cardId === 'weekInfo') return 'Week Info';
    if (cardId === 'announcements') return 'Announcements';
    if (cardId === 'holidays') return 'Holidays';
    if (cardId === 'annualLeave') return 'Annual Leave';
    if (cardId === 'otherLeave') return 'Other Leave';
    if (cardId === 'notes') return 'Notes';
    if (cardId.startsWith('custom_')) {
      const customCard = customCardTypes.find(c => `custom_${c.id}` === cardId);
      return customCard?.label || 'Custom Card';
    }
    return cardId;
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('weekly-summary-collapsed', String(newState));
  };

  // Swipe handlers for mobile carousel
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canGoNext) goToNext();
    },
    onSwipedRight: () => {
      if (canGoPrev) goToPrev();
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 30,
  });

  return (
    <div className="mb-0 space-y-0">
      <div className="relative px-1.5 sm:px-2 sm:pr-10 py-2 border rounded-lg bg-gradient-to-br from-card to-accent/20 overflow-visible weekly-cards-container transition-all duration-300">
        {/* Collapse Toggle Button - Top Right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="absolute top-1 right-1 z-30 h-7 w-7 p-0 hover:bg-background/80 backdrop-blur-sm bg-background/60"
          title={isCollapsed ? 'Show summary cards' : 'Hide summary cards'}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>

        {!isCollapsed && (
          <>
        {/* Mobile Carousel - Only on small screens */}
        <div className="block sm:hidden relative" {...swipeHandlers}>
          {/* Card Indicator Dots - Top */}
          {cards.length > 1 && (
            <div className="flex justify-center items-center gap-2 mb-3">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => goToCard(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentCardIndex 
                      ? 'bg-primary w-3 h-3' 
                      : 'bg-muted-foreground/30 w-2 h-2 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to ${getCardLabel(card.id)}`}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all disabled:opacity-30"
            onClick={goToPrev}
            disabled={!canGoPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all disabled:opacity-30"
            onClick={goToNext}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Card Display - Swipeable */}
          <div className="px-12 py-0.5 touch-pan-y">
            <div className="relative h-[120px] animate-fade-in" key={currentCard?.id}>
              {currentCard?.component}
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Horizontal Row with Arrow Navigation */}
        <div className="hidden sm:block relative pb-4">
          {/* Left Arrow */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
              onClick={() => scrollDesktop('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Right Arrow - vertically centered */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
              onClick={() => scrollDesktop('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          {/* Scrollable Container */}
          <div 
            ref={desktopScrollRef}
            className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card) => (
              <div key={card.id} className="flex-shrink-0">
                {card.component}
              </div>
            ))}
          </div>
        </div>

        {/* Controls - Bottom Right - Desktop/Tablet only */}
        <div className="hidden sm:flex absolute bottom-2 right-3 items-center gap-2 z-30">
          {/* Jump to Card Menu - Tablet only (hidden on desktop) */}
          {cards.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all lg:hidden">
                  Jump to card
                  <ChevronRight className="h-3 w-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-lg z-50 lg:hidden">
                <DropdownMenuLabel>Jump to Card</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cards.map((card) => (
                  <DropdownMenuCheckboxItem
                    key={card.id}
                    checked={false}
                    onCheckedChange={() => scrollToCardById(card.id)}
                  >
                    {getCardLabel(card.id)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Settings Dropdown - Icon only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg z-50">
              <DropdownMenuLabel>Visible Cards</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuCheckboxItem 
                checked={cardVisibility.announcements !== false} 
                onCheckedChange={(v) => toggleCard('announcements', v)}
              >
                Announcements
              </DropdownMenuCheckboxItem>
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

          {/* Add Card Button - Icon only */}
          <ManageCustomCardsDialog iconOnly />
        </div>
        </>
        )}

        {/* Collapsed State - Show minimal info */}
        {isCollapsed && (
          <div className="flex items-center justify-center py-2">
            <span className="text-xs text-muted-foreground">Summary cards hidden</span>
          </div>
        )}
      </div>

      {/* Mobile Controls Row - Only on mobile */}
      <div className="flex sm:hidden justify-end items-center gap-2 px-1.5 py-0.5 border rounded-lg bg-card/50">
        {/* Jump to Card Menu */}
        {cards.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                {getCardLabel(currentCard?.id || '')}
                <ChevronRight className="h-3 w-3 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-lg z-50">
              <DropdownMenuLabel>Jump to Card</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cards.map((card, index) => (
                <DropdownMenuCheckboxItem
                  key={card.id}
                  checked={index === currentCardIndex}
                  onCheckedChange={() => goToCard(index)}
                >
                  {getCardLabel(card.id)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg z-50">
            <DropdownMenuLabel>Visible Cards</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuCheckboxItem 
              checked={cardVisibility.announcements !== false} 
              onCheckedChange={(v) => toggleCard('announcements', v)}
            >
              Announcements
            </DropdownMenuCheckboxItem>
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
