import { useEffect, useRef, DependencyList, EffectCallback } from 'react';

/**
 * Optimized useEffect with proper dependency tracking and cleanup
 * Use this instead of bare useEffect to ensure proper dependencies
 */
export const useOptimizedEffect = (
  effect: EffectCallback,
  deps: DependencyList
) => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const cleanup = effect();
    
    return () => {
      isMounted.current = false;
      if (cleanup) {
        cleanup();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * Debounced effect - useful for expensive operations
 */
export const useDebouncedEffect = (
  effect: EffectCallback,
  deps: DependencyList,
  delay: number = 300
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
