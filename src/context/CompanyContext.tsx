import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type CompanyContextType = {
  company: any | null;
  loading: boolean;
  subdomain: string | null;
  refreshCompany: () => Promise<void>;
  isSubdomainMode: boolean;
};

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  subdomain: null,
  isSubdomainMode: false,
  refreshCompany: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isSubdomainMode, setIsSubdomainMode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Extract subdomain from current hostname
  const extractSubdomain = () => {
    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    
    // For localhost development, support both subdomain.localhost and ?subdomain= parameter
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // First check for subdomain.localhost pattern
      const localParts = window.location.host.split('.');
      if (localParts.length > 1 && localParts[1] === 'localhost') {
        console.log('Found localhost subdomain:', localParts[0]);
        return localParts[0];
      }
      
      // Then check for ?subdomain= parameter
      const querySubdomain = params.get('subdomain');
      if (querySubdomain) {
        console.log('Found subdomain in query param:', querySubdomain);
        return querySubdomain;
      }
    }
    
    // For production (bareresource.com)
    const hostParts = hostname.split('.');
    if (hostParts.length === 3 && hostParts[1] === 'bareresource') {
      console.log('Found production subdomain:', hostParts[0]);
      return hostParts[0];
    }
    
    return null;
  };

  const fetchCompanyData = async (subdomainValue: string) => {
    try {
      setLoading(true);
      console.log('Fetching company data for subdomain:', subdomainValue);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', subdomainValue)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        setCompany(null);
        toast.error('Company not found');
        return;
      }

      console.log('Found company:', data);
      setCompany(data);
    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCompany = async () => {
    try {
      setLoading(true);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, cannot fetch company data");
        setCompany(null);
        return;
      }
      
      // Get user profile to find company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
        
      if (profileError || !profile || !profile.company_id) {
        console.log("No company associated with user profile");
        setCompany(null);
        return;
      }
      
      // Fetch company data using company_id
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();
        
      if (companyError) {
        console.error('Error fetching company by user profile:', companyError);
        setCompany(null);
      } else {
        console.log('Company data fetched by user profile:', companyData);
        setCompany(companyData);
      }
    } catch (error) {
      console.error('Error in company data fetch by user profile:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompany = async () => {
    const currentSubdomain = extractSubdomain();
    console.log('Current subdomain:', currentSubdomain);
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      setIsSubdomainMode(true);
      await fetchCompanyData(currentSubdomain);
    } else {
      setIsSubdomainMode(false);
      await fetchUserCompany();
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN') {
          // Refresh company data when user signs in
          await refreshCompany();
        } else if (event === 'SIGNED_OUT') {
          setCompany(null);
        }
        setAuthChecked(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initial setup
  useEffect(() => {
    const loadInitialData = async () => {
      const currentSubdomain = extractSubdomain();
      console.log('Initial subdomain check:', currentSubdomain);
      setSubdomain(currentSubdomain);
      
      if (currentSubdomain) {
        setIsSubdomainMode(true);
        await fetchCompanyData(currentSubdomain);
      } else {
        setIsSubdomainMode(false);
        await fetchUserCompany();
      }
      setAuthChecked(true);
    };

    loadInitialData();
  }, []);

  // For debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log({
        company: company ? company.name : 'No company',
        subdomain,
        isSubdomainMode
      });
    }
  }, [company, subdomain, isSubdomainMode]);

  return (
    <CompanyContext.Provider value={{ 
      company, 
      loading, 
      subdomain, 
      isSubdomainMode,
      refreshCompany 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
