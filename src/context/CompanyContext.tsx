
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { logger } from '@/utils/logger';

type CompanyContextType = {
  company: any | null;
  loading: boolean;
  companySlug: string | null;
  refreshCompany: () => Promise<void>;
  isPathMode: boolean;
  error: string | null;
};

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  companySlug: null,
  isPathMode: false,
  error: null,
  refreshCompany: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [companySlug, setCompanySlug] = useState<string | null>(null);
  const [isPathMode, setIsPathMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  
  // Ref to prevent duplicate fetches
  const isFetchingRef = useRef(false);
  const lastFetchedCompanyIdRef = useRef<string | null>(null);
  
  const { isDemoMode, profile: demoProfile } = useDemoAuth();

  const extractCompanySlugFromPath = () => {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Public marketing routes that should never be treated as company slugs
    const publicRoutes = ['auth', 'solutions', 'app-tour', 'pricing', 'help', 'faq', 'documentation', 'contact-support', 'privacy-policy'];

    // Company-scoped app routes (must be prefixed by a company slug)
    const companyRoutes = [
      'dashboard', 'profile', 'projects', 'team-members', 'office-settings', 'weekly-overview',
      'weekly-rundown', 'team-workload', 'team-leave', 'project-resourcing', 'financial-control',
      'help-center', 'workflow', 'financial-overview', 'project-profit-dashboard', 'project-billing',
      'aging-invoices', 'resource-scheduling', 'pipeline', 'capacity-heatmap', 'capacity-planning',
      'timeline', 'resource-planning'
    ];

    if (pathParts.length === 0) return null; // Home page

    const first = pathParts[0];

    // Lovable preview can sometimes show route templates like "/:companySlug/...".
    // Treat any ":param" segment as NOT a real company slug.
    if (first.startsWith(':')) return null;

    // /join/:companySlug
    if (first === 'join' && pathParts.length > 1) {
      const maybeSlug = pathParts[1];
      return maybeSlug?.startsWith(':') ? null : maybeSlug;
    }

    // If first segment is a public route, not a company slug
    if (publicRoutes.includes(first)) return null;

    // If URL is exactly "/:companySlug" (single segment) and it's not a known company route, treat as slug
    if (pathParts.length === 1) {
      return companyRoutes.includes(first) ? null : first;
    }

    // If URL is "/:companySlug/:route" and route is a known company route, treat first segment as slug
    if (companyRoutes.includes(pathParts[1])) {
      return first;
    }

    // Otherwise, do not assume it's a company slug (prevents false positives like "/profile")
    return null;
  };

  const fetchCompanyBySlug = async (slugValue: string) => {
    try {
      logger.log('CompanyProvider: fetchCompanyBySlug start', slugValue);
      setLoading(true);
      setError(null);

      // For unauthenticated users, still fetch company data for public pages like /join
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if we're on a public join page
      const isJoinPage = window.location.pathname.startsWith('/join/');
      
      if (!session?.user && !isJoinPage) {
        setCompany(null);
        // Do NOT toast here; unauthenticated users may just be visiting a public slug
        setLoading(false);
        logger.log('CompanyProvider: unauthenticated visit, skipping company fetch');
        return;
      }
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', slugValue)
        .single();

      if (error) {
        logger.warn('CompanyProvider: no company found for slug, continuing without company', {
          slugValue,
          error,
        });
        setCompany(null);
        // Do not surface a toast or error for unknown slugs – auth page should work for any company name
        setError(null);
        return;
      }

      setCompany(data);
      logger.log('CompanyProvider: fetchCompanyBySlug success', data?.id);
    } catch (error: any) {
      logger.error('Error in fetchCompanyBySlug:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      logger.log('CompanyProvider: fetchCompanyBySlug end -> loading=false');
    }
  };

  const fetchCompanyByProfile = async (profile: any) => {
    if (!profile?.company_id) {
      logger.error('CompanyProvider: No company_id in profile', profile);
      setError("Your account is not associated with any company");
      setCompany(null);
      setLoading(false);
      return;
    }
    
    // Prevent duplicate fetches for same company
    if (isFetchingRef.current && lastFetchedCompanyIdRef.current === profile.company_id) {
      logger.log('CompanyProvider: Already fetching company, skipping duplicate request');
      return;
    }
    
    // Skip if already have this company loaded
    if (company?.id === profile.company_id && !error) {
      logger.log('CompanyProvider: Company already loaded, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      isFetchingRef.current = true;
      lastFetchedCompanyIdRef.current = profile.company_id;
      logger.log('CompanyProvider: fetchCompanyByProfile start - company_id:', profile.company_id);
      setLoading(true);
      setError(null);
      
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .maybeSingle();
        
      if (companyError) {
        logger.error('CompanyProvider: Error fetching company by profile:', {
          error: companyError,
          code: companyError.code,
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint
        });
        setError(`Failed to fetch company data: ${companyError.message}`);
        setCompany(null);
        setLoading(false);
        return;
      }
      
      if (!companyData) {
        logger.error('CompanyProvider: No company found for id:', profile.company_id);
        setError(`Company not found for id: ${profile.company_id}`);
        setCompany(null);
        setLoading(false);
        return;
      }
      
      // Successfully fetched company - set state atomically
      logger.log('CompanyProvider: fetchCompanyByProfile success - company:', {
        id: companyData.id,
        name: companyData.name
      });
      setCompany(companyData);
      setError(null);
      setLoading(false);
    } catch (error: any) {
      logger.error('CompanyProvider: Exception in fetchCompanyByProfile:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        logger.error('Error fetching user profile:', error);
        return null;
      }
      
      setUserProfile(profile);
      return profile;
    } catch (error) {
      logger.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshCompany = async () => {
    const currentSlug = extractCompanySlugFromPath();
    setCompanySlug(currentSlug);
    
    if (currentSlug) {
      setIsPathMode(true);
      await fetchCompanyBySlug(currentSlug);
    } else {
      setIsPathMode(false);
      const profile = userProfile || await fetchUserProfile();
      if (profile) {
        await fetchCompanyByProfile(profile);
      }
    }
  };

  // Update company data when auth changes or path changes
  useEffect(() => {
    logger.log('CompanyProvider: Main useEffect triggered');
    const currentSlug = extractCompanySlugFromPath();
    setCompanySlug(currentSlug);
    
    if (currentSlug) {
      // Path mode - company slug in URL
      logger.log('CompanyProvider: Using path mode:', currentSlug);
      setIsPathMode(true);
      fetchCompanyBySlug(currentSlug);
    } else {
      // User profile mode
      logger.log('CompanyProvider: Using profile mode');
      setIsPathMode(false);
      
      // Handle demo mode
      if (isDemoMode && demoProfile) {
        logger.log('CompanyProvider: Using demo profile');
        fetchCompanyByProfile(demoProfile);
        return;
      }
      
      // Handle normal auth
      const initAuth = async () => {
        logger.log('CompanyProvider: Initializing auth...');
        const profile = await fetchUserProfile();
        if (profile) {
          logger.log('CompanyProvider: Profile fetched, loading company...');
          await fetchCompanyByProfile(profile);
        } else {
          logger.error('CompanyProvider: No profile found after fetch');
          setError("No profile found");
          setCompany(null);
          setLoading(false);
        }
      };
      
      initAuth();
    }
  }, [isDemoMode, demoProfile, location.pathname]);

  // Listen for auth state changes and refetch company
  useEffect(() => {
    logger.log('CompanyProvider: Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.log('CompanyProvider: Auth state changed:', event, session?.user?.id);
      
      // Only refetch on SIGNED_IN / INITIAL_SESSION / TOKEN_REFRESHED with valid session
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        const currentSlug = extractCompanySlugFromPath();
        if (!currentSlug) {
          logger.log('CompanyProvider: Auth changed, scheduling profile/company refetch...');
          // Defer Supabase calls to avoid auth deadlocks
          setTimeout(async () => {
            const profile = await fetchUserProfile();
            if (profile) {
              await fetchCompanyByProfile(profile);
            }
          }, 0);
        }
      }
    });

    return () => {
      logger.log('CompanyProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

 
  return (
    <CompanyContext.Provider value={{ 
      company, 
      loading, 
      companySlug, 
      isPathMode,
      error,
      refreshCompany 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
