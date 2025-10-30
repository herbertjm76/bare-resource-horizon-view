import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonRundownCard } from './PersonRundownCard';
import { ProjectRundownCard } from './ProjectRundownCard';
import { RundownMode } from './WeeklyRundownView';

interface RundownCarouselProps {
  items: any[];
  currentIndex: number;
  rundownMode: RundownMode;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  isFullscreen: boolean;
  selectedWeek: Date;
}

export const RundownCarousel: React.FC<RundownCarouselProps> = ({
  items,
  currentIndex,
  rundownMode,
  onNext,
  onPrev,
  onGoTo,
  isFullscreen,
  selectedWeek
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    startIndex: currentIndex,
    loop: false,
    align: 'center'
  });

  const isInitialized = useRef(false);

  // Sync embla with external index changes
  useEffect(() => {
    if (emblaApi && isInitialized.current) {
      emblaApi.scrollTo(currentIndex);
    }
  }, [currentIndex, emblaApi]);

  // Handle embla scroll events
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      isInitialized.current = true;
      const selectedIndex = emblaApi.selectedScrollSnap();
      if (selectedIndex !== currentIndex) {
        onGoTo(selectedIndex);
      }
    };

    emblaApi.on('select', onSelect);
    // Set initialized flag after first selection
    if (!isInitialized.current) {
      isInitialized.current = true;
    }

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, currentIndex, onGoTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, isFullscreen]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-card rounded-lg border">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No {rundownMode} found for this week</p>
          <p className="text-sm text-muted-foreground mt-2">Try selecting a different week or check your filters</p>
        </div>
      </div>
    );
  }

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < items.length - 1;

  return (
    <div className="relative">
      {/* Navigation buttons - Enhanced */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={!canScrollPrev}
          className="h-14 w-14 rounded-full bg-background/90 backdrop-blur-md border-2 border-primary/20 shadow-2xl hover:shadow-primary/30 hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100"
        >
          <ChevronLeft className="h-7 w-7" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canScrollNext}
          className="h-14 w-14 rounded-full bg-background/90 backdrop-blur-md border-2 border-primary/20 shadow-2xl hover:shadow-primary/30 hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100"
        >
          <ChevronRight className="h-7 w-7" />
        </Button>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex-[0_0_100%] min-w-0 px-4"
            >
              <div className="mx-auto max-w-4xl">
                {rundownMode === 'people' ? (
                  <PersonRundownCard 
                    person={item} 
                    isActive={index === currentIndex}
                    isFullscreen={isFullscreen}
                    selectedWeek={selectedWeek}
                  />
                ) : (
                  <ProjectRundownCard 
                    project={item} 
                    isActive={index === currentIndex}
                    isFullscreen={isFullscreen}
                    selectedWeek={selectedWeek}
                    onDataChange={() => {}}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Dots indicator with progress */}
      {items.length > 1 && (
        <div className="flex justify-center items-center mt-8 gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoTo(index)}
              className={`rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex 
                  ? 'bg-primary w-12 h-3 shadow-lg shadow-primary/30' 
                  : 'bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Keyboard navigation hint */}
      {items.length > 1 && (
        <div className="flex justify-center mt-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded border border-border">←</kbd>
            <kbd className="px-2 py-1 bg-muted rounded border border-border">→</kbd>
            <span>Navigate with keyboard</span>
          </p>
        </div>
      )}
    </div>
  );
};