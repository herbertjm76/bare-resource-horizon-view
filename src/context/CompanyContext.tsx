
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEnhancedDashboardAuth } from '@/hooks/useEnhancedDashboardAuth';

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
  
  const dashboardAuth = useEnhancedDashboardAuth();

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

  const refreshCompany = async () => {
    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      setIsSubdomainMode(true);
      await fetchCompanyBySubdomain(currentSubdomain);
    } else {
      setIsSubdomainMode(false);
      if (dashboardAuth.profile) {
        await fetchCompanyByProfile(dashboardAuth.profile);
      }
    }
  };

  // Update company data when dashboard auth changes
  useEffect(() => {
    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      // Subdomain mode
      setIsSubdomainMode(true);
      fetchCompanyBySubdomain(currentSubdomain);
    } else {
      // User profile mode
      setIsSubdomainMode(false);
      if (!dashboardAuth.loading && dashboardAuth.profile) {
        fetchCompanyByProfile(dashboardAuth.profile);
      } else if (!dashboardAuth.loading && !dashboardAuth.profile) {
        setError("No profile found");
        setCompany(null);
        setLoading(false);
      } else {
        setLoading(dashboardAuth.loading);
      }
    }
  }, [dashboardAuth.loading, dashboardAuth.profile]);

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
