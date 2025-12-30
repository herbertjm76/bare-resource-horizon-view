import { useRef, useCallback, useEffect, useState } from 'react';

interface UseDragScrollOptions {
  speed?: number; // Scroll speed multiplier
}

export const useDragScroll = (options: UseDragScrollOptions = {}) => {
  const { speed = 1 } = options;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Drag state refs to avoid stale closures
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = scrollRef.current;
    if (!container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * speed;
    
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    
    container.scrollLeft = scrollLeftRef.current - walk;
  }, [speed]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    const container = scrollRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const container = scrollRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * speed;
    
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    
    container.scrollLeft = scrollLeftRef.current - walk;
  }, [speed]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Scroll programmatically
  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, []);

  // Setup global mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Setup scroll position checking with ResizeObserver and MutationObserver for content changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    // Use ResizeObserver to detect when container content changes size
    const resizeObserver = new ResizeObserver(() => {
      checkScrollPosition();
    });
    resizeObserver.observe(container);
    
    // Observe all children for size changes
    Array.from(container.children).forEach(child => {
      resizeObserver.observe(child);
    });

    // Use MutationObserver to detect when children are added/removed
    const mutationObserver = new MutationObserver(() => {
      checkScrollPosition();
      // Re-observe new children
      Array.from(container.children).forEach(child => {
        resizeObserver.observe(child);
      });
    });
    mutationObserver.observe(container, { childList: true, subtree: true });

    // Check multiple times for async content loading
    const timers = [100, 300, 500, 1000, 2000].map(delay => 
      setTimeout(checkScrollPosition, delay)
    );

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [checkScrollPosition]);

  // Check if a click should be prevented (was actually a drag)
  const shouldPreventClick = useCallback(() => {
    return hasDraggedRef.current;
  }, []);

  return {
    scrollRef,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scroll,
    checkScrollPosition,
    shouldPreventClick,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    containerStyle: {
      cursor: 'grab',
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
    },
  };
};
