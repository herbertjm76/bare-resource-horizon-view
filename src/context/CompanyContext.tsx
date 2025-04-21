
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
    
    // For localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check if using subdomain.localhost pattern
      const localParts = window.location.host.split('.');
      if (localParts.length > 1 && localParts[1] === 'localhost') {
        return localParts[0];
      }
      // For development, optionally get subdomain from query param
      const params = new URLSearchParams(window.location.search);
      return params.get('subdomain');
    }
    
    // For production/deployed version
    const hostParts = hostname.split('.');
    // Check if it's likely a subdomain (e.g., company.bareresource.com)
    if (hostParts.length > 2) {
      if (hostParts[1] === 'bareresource') {
        return hostParts[0];
      }
      // Handle custom domains like company.lovable.app
      if (hostParts[1] === 'lovable' && hostParts[2] === 'app') {
        return hostParts[0];
      }
    }
    
    return null;
  };

  const fetchCompanyData = async (subdomainValue: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', subdomainValue)
        .single();

      if (error) {
        console.error('Error fetching company by subdomain:', error);
        setCompany(null);
      } else {
        console.log('Company data fetched by subdomain:', data);
        setCompany(data);
      }
    } catch (error) {
      console.error('Error in company data fetch by subdomain:', error);
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

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      const currentSubdomain = extractSubdomain();
      setSubdomain(currentSubdomain);
      
      if (currentSubdomain) {
        console.log("Subdomain detected:", currentSubdomain);
        setIsSubdomainMode(true);
        await fetchCompanyData(currentSubdomain);
      } else {
        console.log("No subdomain detected, using user profile");
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
