
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
    } catch (error: any) {
      console.error('Error in fetchCompanyBySubdomain:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyByProfile = async (profile: any) => {
    if (!profile?.company_id) {
      setError("Your account is not associated with any company");
      setCompany(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();
        
      if (companyError) {
        console.error('Error fetching company by profile:', companyError);
        setError("Failed to fetch company data");
        setCompany(null);
      } else {
        setCompany(companyData);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error in fetchCompanyByProfile:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
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
    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    setLoading(true); // Always start with loading true
    
    if (currentSubdomain) {
      // Subdomain mode
      setIsSubdomainMode(true);
      fetchCompanyBySubdomain(currentSubdomain);
    } else {
      // User profile mode
      setIsSubdomainMode(false);
      
      // Handle demo mode
      if (isDemoMode && demoProfile) {
        fetchCompanyByProfile(demoProfile);
        return;
      }
      
      // Handle normal auth
      const initAuth = async () => {
        try {
          const profile = await fetchUserProfile();
          if (profile) {
            await fetchCompanyByProfile(profile);
          } else {
            setError("No profile found");
            setCompany(null);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error in initAuth:', error);
          setError("Failed to initialize authentication");
          setCompany(null);
          setLoading(false);
        }
      };
      
      initAuth();
    }
  }, [isDemoMode, demoProfile]);

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
