
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  subdomain: string;
  industry?: string;
  size?: string;
  [key: string]: any;
}

interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  error: Error | null;
  isSubdomainMode: boolean;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  error: null,
  isSubdomainMode: false,
  refreshCompany: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubdomainMode, setIsSubdomainMode] = useState(false);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching company data...');

      // First check if we're on a custom subdomain
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isDevelopmentDomain = hostname.includes('lovable.app');
      
      let companyId: string | null = null;
      let subdomain: string | null = null;

      // Check for subdomain mode
      if (!isLocalhost && isDevelopmentDomain) {
        // Extract subdomain from hostname (e.g., company.lovable.app)
        subdomain = hostname.split('.')[0];
        console.log('Detected subdomain:', subdomain);
        
        if (subdomain) {
          setIsSubdomainMode(true);
          
          // Look up company by subdomain
          const { data: companyData, error: subdomainError } = await supabase
            .from('companies')
            .select('*')
            .eq('subdomain', subdomain)
            .single();
            
          if (subdomainError) {
            if (subdomainError.code !== 'PGRST116') { // Not found
              console.error('Error fetching company by subdomain:', subdomainError);
            }
          } else if (companyData) {
            console.log('Found company by subdomain:', companyData.name);
            setCompany(companyData);
            setLoading(false);
            return;
          }
        }
      }
      
      // If not subdomain mode or subdomain not found, try to get company from user profile
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        setLoading(false);
        return;
      }
      
      console.log('Getting user profile for ID:', session.user.id);
      
      // Get user profile to find company ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        if (profileError.code !== 'PGRST116') { // Not found error
          throw profileError;
        }
        setLoading(false);
        return;
      }
      
      if (!profile?.company_id) {
        console.log('No company ID found in user profile');
        setLoading(false);
        return;
      }
      
      companyId = profile.company_id;
      console.log('Found company ID in profile:', companyId);
      
      // Get company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
        
      if (companyError) {
        console.error('Error fetching company details:', companyError);
        throw companyError;
      }
      
      console.log('Company data loaded:', companyData.name);
      setCompany(companyData);
      
    } catch (fetchError) {
      console.error('Error in company context:', fetchError);
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)));
      toast.error('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCompanyData();
    
    // Listen for auth state changes to refresh company data
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      console.log('Auth state changed, refreshing company data');
      fetchCompanyData();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <CompanyContext.Provider 
      value={{ 
        company, 
        loading, 
        error, 
        isSubdomainMode, 
        refreshCompany: fetchCompanyData 
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
