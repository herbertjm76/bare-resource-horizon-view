
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDemoAuth } from '@/hooks/useDemoAuth';

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
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [companySlug, setCompanySlug] = useState<string | null>(null);
  const [isPathMode, setIsPathMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  
  const { isDemoMode, profile: demoProfile } = useDemoAuth();

  const extractCompanySlugFromPath = () => {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Public marketing routes that should never be treated as company slugs
    const publicRoutes = ['auth', 'solutions', 'app-tour', 'pricing', 'help', 'faq', 'documentation', 'contact-support', 'privacy-policy'];

    // Company-scoped app routes (must be prefixed by a company slug)
    const companyRoutes = [
      'dashboard', 'profile', 'projects', 'team-members', 'office-settings', 'weekly-overview',
      'weekly-rundown', 'team-workload', 'team-annual-leave', 'project-resourcing', 'financial-control',
      'help-center', 'workflow', 'financial-overview', 'project-profit-dashboard', 'project-billing',
      'aging-invoices', 'resource-scheduling'
    ];

    if (pathParts.length === 0) return null; // Home page

    const first = pathParts[0];

    // /join/:companySlug
    if (first === 'join' && pathParts.length > 1) {
      return pathParts[1];
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
      console.log('CompanyProvider: fetchCompanyBySlug start', slugValue);
      setLoading(true);
      setError(null);

      // If user is not authenticated, skip querying companies to avoid RLS errors
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setCompany(null);
        // Do NOT toast here; unauthenticated users may just be visiting a public slug
        setLoading(false);
        console.log('CompanyProvider: unauthenticated visit, skipping company fetch');
        return;
      }
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', slugValue)
        .single();

      if (error) {
        console.warn('CompanyProvider: no company found for slug, continuing without company', {
          slugValue,
          error,
        });
        setCompany(null);
        // Do not surface a toast or error for unknown slugs – auth page should work for any company name
        setError(null);
        return;
      }

      setCompany(data);
      console.log('CompanyProvider: fetchCompanyBySlug success', data?.id);
    } catch (error: any) {
      console.error('Error in fetchCompanyBySlug:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      console.log('CompanyProvider: fetchCompanyBySlug end -> loading=false');
    }
  };

  const fetchCompanyByProfile = async (profile: any) => {
    if (!profile?.company_id) {
      console.error('CompanyProvider: No company_id in profile', profile);
      setError("Your account is not associated with any company");
      setCompany(null);
      setLoading(false);
      return;
    }
    
    try {
      console.log('CompanyProvider: fetchCompanyByProfile start - company_id:', profile.company_id);
      setLoading(true);
      setError(null);
      
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .maybeSingle();
        
      if (companyError) {
        console.error('CompanyProvider: Error fetching company by profile:', {
          error: companyError,
          code: companyError.code,
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint
        });
        setError(`Failed to fetch company data: ${companyError.message}`);
        setCompany(null);
      } else if (!companyData) {
        console.error('CompanyProvider: No company found for id:', profile.company_id);
        setError(`Company not found for id: ${profile.company_id}`);
        setCompany(null);
      } else {
        setCompany(companyData);
        setError(null);
        console.log('CompanyProvider: fetchCompanyByProfile success - company:', {
          id: companyData.id,
          name: companyData.name
        });
      }
    } catch (error: any) {
      console.error('CompanyProvider: Exception in fetchCompanyByProfile:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      console.log('CompanyProvider: fetchCompanyByProfile end -> loading=false, company=', company?.id || 'null');
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
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
    console.log('CompanyProvider: Main useEffect triggered');
    const currentSlug = extractCompanySlugFromPath();
    setCompanySlug(currentSlug);
    
    if (currentSlug) {
      // Path mode - company slug in URL
      console.log('CompanyProvider: Using path mode:', currentSlug);
      setIsPathMode(true);
      fetchCompanyBySlug(currentSlug);
    } else {
      // User profile mode
      console.log('CompanyProvider: Using profile mode');
      setIsPathMode(false);
      
      // Handle demo mode
      if (isDemoMode && demoProfile) {
        console.log('CompanyProvider: Using demo profile');
        fetchCompanyByProfile(demoProfile);
        return;
      }
      
      // Handle normal auth
      const initAuth = async () => {
        console.log('CompanyProvider: Initializing auth...');
        const profile = await fetchUserProfile();
        if (profile) {
          console.log('CompanyProvider: Profile fetched, loading company...');
          await fetchCompanyByProfile(profile);
        } else {
          console.error('CompanyProvider: No profile found after fetch');
          setError("No profile found");
          setCompany(null);
          setLoading(false);
        }
      };
      
      initAuth();
    }
  }, [isDemoMode, demoProfile, window.location.pathname]);

  // Listen for auth state changes and refetch company
  useEffect(() => {
    console.log('CompanyProvider: Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('CompanyProvider: Auth state changed:', event, session?.user?.id);
      
      // Only refetch on SIGNED_IN / INITIAL_SESSION / TOKEN_REFRESHED with valid session
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        const currentSlug = extractCompanySlugFromPath();
        if (!currentSlug) {
          console.log('CompanyProvider: Auth changed, scheduling profile/company refetch...');
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
      console.log('CompanyProvider: Cleaning up auth listener');
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
