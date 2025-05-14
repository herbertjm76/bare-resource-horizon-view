
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyContextType } from './types';
import { useCompanyState } from './useCompanyState';

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  error: null,
  isSubdomainMode: false,
  refreshCompany: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    company, 
    loading, 
    error, 
    isSubdomainMode, 
    refreshCompany 
  } = useCompanyState();
  
  // Initial fetch
  useEffect(() => {
    refreshCompany();
    
    // Listen for auth state changes to refresh company data
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Small delay to ensure database is updated
        setTimeout(() => refreshCompany(), 300);
      } else if (event === 'SIGNED_OUT') {
        // No need to call setCompany(null) directly, as it's handled in the useCompanyState
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
        refreshCompany 
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
