import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_COMPANY_ID, DEMO_COMPANY } from '@/data/demoData';

interface UseCompanyIdResult {
  /** The company ID, only defined when ready */
  companyId: string | undefined;
  /** True when company context is fully loaded and has a valid ID */
  isReady: boolean;
  /** True when company context is still loading */
  isLoading: boolean;
  /** Error message if company failed to load */
  error: string | null;
  /** The full company object (for cases where more than ID is needed) */
  company: any | null;
}

/**
 * Centralized hook for accessing company ID with proper loading state handling.
 * 
 * This hook ensures that:
 * 1. `companyId` is only returned when the company context is fully loaded
 * 2. `isReady` can be used directly as the `enabled` condition for React Query hooks
 * 3. All hooks using company data have consistent behavior
 * 4. Demo mode returns demo company data immediately
 * 
 * Usage in React Query hooks:
 * ```ts
 * const { companyId, isReady } = useCompanyId();
 * 
 * const { data } = useQuery({
 *   queryKey: ['my-data', companyId],
 *   queryFn: async () => { ... },
 *   enabled: isReady,
 * });
 * ```
 */
export const useCompanyId = (): UseCompanyIdResult => {
  const { isDemoMode } = useDemoAuth();
  const { company, loading: companyLoading, error: companyError } = useCompany();
  
  // In demo mode, return demo company data immediately
  if (isDemoMode) {
    return {
      companyId: DEMO_COMPANY_ID,
      isReady: true,
      isLoading: false,
      error: null,
      company: DEMO_COMPANY,
    };
  }
  
  const companyId = company?.id;
  
  // CRITICAL: isReady is true only when:
  // 1. Company context is NOT loading
  // 2. Company ID exists
  // 3. No error occurred
  const isReady = !companyLoading && !!companyId && !companyError;
  
  return {
    companyId: isReady ? companyId : undefined,
    isReady,
    isLoading: companyLoading,
    error: companyError,
    company: isReady ? company : null,
  };
};
