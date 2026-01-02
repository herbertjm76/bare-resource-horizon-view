import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselNavigationProps {
  totalItems: number;
  autoAdvance: boolean;
  interval?: number;
}

export const useCarouselNavigation = ({
  totalItems,
  autoAdvance,
  interval = 10000
}: UseCarouselNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoAdvanceActive, setIsAutoAdvanceActive] = useState(autoAdvance);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset index when total items change
  useEffect(() => {
    if (currentIndex >= totalItems && totalItems > 0) {
      setCurrentIndex(0);
    }
  }, [totalItems, currentIndex]);

  // Auto-advance logic
  useEffect(() => {
    if (isAutoAdvanceActive && totalItems > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % totalItems);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoAdvanceActive, totalItems, interval]);

  // Update auto-advance state when prop changes
  useEffect(() => {
    setIsAutoAdvanceActive(autoAdvance);
  }, [autoAdvance]);

  const nextItem = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalItems);
    // Pause auto-advance temporarily when manually navigating
    if (isAutoAdvanceActive) {
      setIsAutoAdvanceActive(false);
      setTimeout(() => setIsAutoAdvanceActive(autoAdvance), 5000);
    }
  }, [totalItems, isAutoAdvanceActive, autoAdvance]);

  const prevItem = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems);
    // Pause auto-advance temporarily when manually navigating
    if (isAutoAdvanceActive) {
      setIsAutoAdvanceActive(false);
      setTimeout(() => setIsAutoAdvanceActive(autoAdvance), 5000);
    }
  }, [totalItems, isAutoAdvanceActive, autoAdvance]);

  const goToItem = useCallback((index: number) => {
    // Allow setting to 0 always, otherwise validate against totalItems
    if (index === 0 || (index > 0 && index < totalItems)) {
      setCurrentIndex(index);
      // Pause auto-advance temporarily when manually navigating
      if (isAutoAdvanceActive) {
        setIsAutoAdvanceActive(false);
        setTimeout(() => setIsAutoAdvanceActive(autoAdvance), 5000);
      }
    }
  }, [totalItems, isAutoAdvanceActive, autoAdvance]);

  const toggleAutoAdvance = useCallback(() => {
    setIsAutoAdvanceActive(prev => !prev);
  }, []);

  return {
    currentIndex,
    nextItem,
    prevItem,
    goToItem,
    toggleAutoAdvance,
    isAutoAdvanceActive
  };
};