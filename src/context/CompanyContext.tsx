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
      console.log('Fetching company data for subdomain:', subdomainValue);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', subdomainValue)
        .single();

      if (error) {
        console.error('Error fetching company by subdomain:', error);
        setCompany(null);
        toast.error('Company not found');
        return;
      }

      console.log('Found company by subdomain:', data);
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
      console.log('Attempting to fetch user company');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, cannot fetch company data");
        setCompany(null);
        setLoading(false);
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
        
      if (profileError || !profile || !profile.company_id) {
        console.log("No company associated with user profile");
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
    console.log('Refreshing company data...');
    
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error in refreshCompany:', error);
      toast.error('Error refreshing company data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN') {
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

  useEffect(() => {
    const loadInitialData = async () => {
      console.log('CompanyContext: Initial loading started');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current auth session:', session ? 'Exists' : 'None');
        
        await refreshCompany();
      } catch (error) {
        console.error('Error in initial company data load:', error);
        setLoading(false);
      }
      
      setAuthChecked(true);
      console.log('CompanyContext: Initial loading completed');
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    console.log('CompanyContext state updated:', {
      company: company ? company.name : 'No company',
      subdomain,
      isSubdomainMode,
      loading,
      authChecked
    });
  }, [company, subdomain, isSubdomainMode, loading, authChecked]);

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
