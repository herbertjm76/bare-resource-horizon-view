import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
          
          try {
            // Look up company by subdomain
            const { data: companyData, error: subdomainError } = await supabase
              .from('companies')
              .select('*')
              .eq('subdomain', subdomain)
              .maybeSingle();
              
            if (subdomainError) {
              console.error('Error fetching company by subdomain:', subdomainError);
            } else if (companyData) {
              console.log('Found company by subdomain:', companyData.name);
              setCompany(companyData);
              setLoading(false);
              return;
            } else {
              console.error('No company found for subdomain:', subdomain);
              // Don't navigate here, let the Not Found component handle this case
            }
          } catch (err) {
            console.error('Error in subdomain lookup:', err);
          }
        }
      }
      
      // Get session to check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        setLoading(false);
        // If on a specific page that needs company data like /join, keep the loading state
        // Otherwise just show the login page without company data
        if (window.location.pathname.startsWith('/join')) {
          const companyIdParam = new URLSearchParams(window.location.search).get('companyId');
          if (companyIdParam) {
            await fetchCompanyById(companyIdParam);
          }
        }
        return;
      }
      
      console.log('Getting user profile for ID:', session.user.id);
      
      try {
        // Get user profile to find company ID
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Don't throw here, try to create profile as fallback
          const { error } = await supabase.from('profiles')
            .insert({ id: session.user.id, email: session.user.email })
            .select();
          
          if (error) console.error('Error creating profile:', error);
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
        
        await fetchCompanyById(companyId);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setLoading(false);
      }
    } catch (fetchError) {
      console.error('Error in company context:', fetchError);
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)));
      toast.error('Failed to load company data');
      setLoading(false);
    }
  };

  const fetchCompanyById = async (companyId: string) => {
    try {
      // Get company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
        
      if (companyError) {
        console.error('Error fetching company details:', companyError);
        throw companyError;
      }
      
      if (companyData) {
        console.log('Company data loaded:', companyData.name);
        setCompany(companyData);
      } else {
        console.error('No company found with ID:', companyId);
        // Handle "company not found" case
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/auth') && currentPath !== '/') {
          toast.error('Company not found. Please contact support.');
        }
      }
    } catch (err) {
      console.error('Error fetching company by ID:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCompanyData();
    
    // Listen for auth state changes to refresh company data
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Small delay to ensure database is updated
        setTimeout(() => fetchCompanyData(), 300);
      } else if (event === 'SIGNED_OUT') {
        setCompany(null);
      }
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
