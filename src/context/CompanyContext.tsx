
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type CompanyContextType = {
  company: any | null;
  loading: boolean;
  subdomain: string | null;
};

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  subdomain: null,
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
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
      if (hostParts.length > 2 && hostParts[1] === 'bareresource') {
        return hostParts[0];
      }
      
      return null;
    };

    const fetchCompanyData = async (subdomainValue: string) => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('subdomain', subdomainValue)
          .single();

        if (error) {
          console.error('Error fetching company:', error);
          setCompany(null);
        } else {
          setCompany(data);
        }
      } catch (error) {
        console.error('Error in company data fetch:', error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    const currentSubdomain = extractSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain) {
      fetchCompanyData(currentSubdomain);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <CompanyContext.Provider value={{ company, loading, subdomain }}>
      {children}
    </CompanyContext.Provider>
  );
};
