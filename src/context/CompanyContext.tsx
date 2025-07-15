
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchUserCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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
        setError("Failed to fetch user profile");
        setCompany(null);
        setLoading(false);
        return;
      }
      
      if (!profile || !profile.company_id) {
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
        setError("Failed to fetch company data");
        setCompany(null);
      } else {
        setCompany(companyData);
        setError(null);
      }
    } catch (error: any) {
      setCompany(null);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const refreshCompany = async () => {
    await fetchUserCompany();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserCompany();
      } else {
        setLoading(false);
        setError('No active session found. Please log in.');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          await fetchUserCompany();
        } else if (event === 'SIGNED_OUT') {
          setCompany(null);
          setError(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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
