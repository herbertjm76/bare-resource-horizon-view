
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDemoAuth } from '@/hooks/useDemoAuth';

type CompanyContextType = {
  company: any | null;
  loading: boolean;
  subdomain: string | null;
  refreshCompany: () => Promise<void>;
  isSubdomainMode: boolean;
  error: string | null;
};

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  subdomain: null,
  isSubdomainMode: false,
  error: null,
  refreshCompany: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isSubdomainMode, setIsSubdomainMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  
  const { isDemoMode, profile: demoProfile } = useDemoAuth();

  const extractSubdomain = () => {
    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    
    const querySubdomain = params.get('subdomain');
    if (querySubdomain) {
      return querySubdomain;
    }
    
    if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1') {
      const localParts = window.location.host.split('.');
      if (localParts.length > 1 && (localParts[1] === 'localhost' || localParts[1].includes('localhost:'))) {
        return localParts[0];
      }
    }
    
    const hostParts = hostname.split('.');
    
    // Handle custom domain bareresource.com (no subdomain)
    if (hostname === 'bareresource.com') {
      return null; // Will fall back to user company lookup
    }
    
    // Handle subdomain pattern like subdomain.bareresource.com
    if (hostParts.length === 3 && hostParts[1] === 'bareresource') {
      return hostParts[0];
    }
    
    return null;
  };

  const fetchCompanyBySubdomain = async (subdomainValue: string) => {
    try {
      console.log('CompanyProvider: fetchCompanyBySubdomain start', subdomainValue);
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', subdomainValue)
        .single();

      if (error) {
        console.error('Error fetching company by subdomain:', error);
        setCompany(null);
        setError(`Company not found for subdomain "${subdomainValue}"`);
        toast.error('Company not found');
        return;
      }

      setCompany(data);
      console.log('CompanyProvider: fetchCompanyBySubdomain success', data?.id);
    } catch (error: any) {
      console.error('Error in fetchCompanyBySubdomain:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      console.log('CompanyProvider: fetchCompanyBySubdomain end -> loading=false');
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
    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      setIsSubdomainMode(true);
      await fetchCompanyBySubdomain(currentSubdomain);
    } else {
      setIsSubdomainMode(false);
      const profile = userProfile || await fetchUserProfile();
      if (profile) {
        await fetchCompanyByProfile(profile);
      }
    }
  };

  // Update company data when auth changes
  useEffect(() => {
    console.log('CompanyProvider: Main useEffect triggered');
    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      // Subdomain mode
      console.log('CompanyProvider: Using subdomain mode:', currentSubdomain);
      setIsSubdomainMode(true);
      fetchCompanyBySubdomain(currentSubdomain);
    } else {
      // User profile mode
      console.log('CompanyProvider: Using profile mode');
      setIsSubdomainMode(false);
      
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
  }, [isDemoMode, demoProfile]);

  // Listen for auth state changes and refetch company
  useEffect(() => {
    console.log('CompanyProvider: Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('CompanyProvider: Auth state changed:', event, session?.user?.id);
      
      // Only refetch on SIGNED_IN or INITIAL_SESSION with valid session
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        const currentSubdomain = extractSubdomain();
        if (!currentSubdomain) {
          console.log('CompanyProvider: Auth changed, refetching profile and company...');
          const profile = await fetchUserProfile();
          if (profile) {
            await fetchCompanyByProfile(profile);
          }
        }
      }
    });

    return () => {
      console.log('CompanyProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Extended safety timeout (30s instead of 6s)
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      console.error('CompanyProvider: Safety timeout (30s) reached - forcing loading=false');
      console.error('CompanyProvider: Current state:', { company: company?.id, error, subdomain, isSubdomainMode });
      setLoading(false);
      if (!company && !error) {
        setError('Timeout loading company data. Please refresh the page.');
      }
    }, 30000);
    return () => clearTimeout(t);
  }, [loading]);
 
  return (
    <CompanyContext.Provider value={{ 
      company, 
      loading, 
      subdomain, 
      isSubdomainMode,
      error,
      refreshCompany 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
