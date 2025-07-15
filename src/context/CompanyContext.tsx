
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadAttempted = useRef(false);

  const extractSubdomain = () => {
    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    
    console.log('Extracting subdomain from:', hostname);
    
    const querySubdomain = params.get('subdomain');
    if (querySubdomain) {
      console.log('Found subdomain in query param:', querySubdomain);
      return querySubdomain;
    }
    
    if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1') {
      console.log('Checking for localhost subdomain pattern');
      
      const localParts = window.location.host.split('.');
      if (localParts.length > 1 && (localParts[1] === 'localhost' || localParts[1].includes('localhost:'))) {
        const extractedSubdomain = localParts[0];
        console.log('Found localhost subdomain:', extractedSubdomain);
        return extractedSubdomain;
      }
    }
    
    const hostParts = hostname.split('.');
    
    // Handle custom domain bareresource.com (no subdomain)
    if (hostname === 'bareresource.com') {
      console.log('Using custom domain bareresource.com - checking for user company');
      return null; // Will fall back to user company lookup
    }
    
    // Handle subdomain pattern like subdomain.bareresource.com
    if (hostParts.length === 3 && hostParts[1] === 'bareresource') {
      console.log('Found production subdomain:', hostParts[0]);
      return hostParts[0];
    }
    
    console.log('No subdomain found, will use user company');
    return null;
  };

  const fetchCompanyData = async (subdomainValue: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching company data for subdomain:', subdomainValue);
      
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

      console.log('Found company by subdomain:', data);
      setCompany(data);
    } catch (error: any) {
      console.error('Error in fetchCompanyData:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      // Clear any loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  };

  const fetchUserCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to fetch user company');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, cannot fetch company data");
        setCompany(null);
        setError("No active session found. Please log in.");
        setLoading(false);
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        setError("Failed to fetch user profile");
        setCompany(null);
        setLoading(false);
        return;
      }
      
      if (!profile || !profile.company_id) {
        console.log("No company associated with user profile");
        setError("Your account is not associated with any company");
        setCompany(null);
        setLoading(false);
        return;
      }
      
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();
        
      if (companyError) {
        console.error('Error fetching company by user profile:', companyError);
        setError("Failed to fetch company data");
        setCompany(null);
      } else {
        console.log('Company data fetched by user profile:', companyData);
        setCompany(companyData);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error in company data fetch by user profile:', error);
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
      // Clear any loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  };

  const refreshCompany = async () => {
    console.log('Refreshing company data...');
    
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent eternal loading state
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Company data fetch timeout reached');
        setLoading(false);
        setError('Company data fetch timed out. Please try again.');
        toast.error('Data fetch timed out, please refresh');
      }, 10000); // 10 second timeout
      
      const currentSubdomain = extractSubdomain();
      console.log('Current subdomain check result:', currentSubdomain);
      setSubdomain(currentSubdomain);
      
      if (currentSubdomain) {
        console.log('Using subdomain mode with:', currentSubdomain);
        setIsSubdomainMode(true);
        await fetchCompanyData(currentSubdomain);
      } else {
        console.log('Using user profile mode');
        setIsSubdomainMode(false);
        await fetchUserCompany();
      }
      
      console.log('Company refresh completed');
    } catch (error: any) {
      console.error('Error in refreshCompany:', error);
      setError(error.message || 'Error refreshing company data');
      toast.error('Error refreshing company data');
    } finally {
      setLoading(false);
      // Always clear the timeout in finally block
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('CompanyContext: Initial loading started');
      setAuthChecked(false);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current auth session:', session ? 'Exists' : 'None');
        
        if (session) {
          await refreshCompany();
        } else {
          setLoading(false);
          setError('No active session found. Please log in.');
        }
      } catch (error: any) {
        console.error('Error in initial auth check:', error);
        setLoading(false);
        setError(error.message || 'Failed to load initial data');
      }
      
      setAuthChecked(true);
    };

    // Only run initial auth check once
    if (!initialLoadAttempted.current) {
      initialLoadAttempted.current = true;
      initializeAuth();
    }

    // Set up auth listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log("Auth state changed:", event);
        setAuthChecked(true);
        
        if (event === 'SIGNED_IN') {
          await refreshCompany();
        } else if (event === 'SIGNED_OUT') {
          setCompany(null);
          setError(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('CompanyContext state updated:', {
      company: company ? company.name : 'No company',
      subdomain,
      isSubdomainMode,
      loading,
      authChecked,
      error
    });
  }, [company, subdomain, isSubdomainMode, loading, authChecked, error]);

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

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
