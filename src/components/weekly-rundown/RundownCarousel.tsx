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
}

export const RundownCarousel: React.FC<RundownCarouselProps> = ({
  items,
  currentIndex,
  rundownMode,
  onNext,
  onPrev,
  onGoTo,
  isFullscreen
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
      {/* Navigation buttons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={!canScrollPrev}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canScrollNext}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6" />
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
                  />
                ) : (
                  <ProjectRundownCard 
                    project={item} 
                    isActive={index === currentIndex}
                    isFullscreen={isFullscreen}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};