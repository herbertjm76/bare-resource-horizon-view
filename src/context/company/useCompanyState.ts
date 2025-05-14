import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from './types';
import { fetchCompanyById, fetchCompanyBySubdomain, getUserProfile, detectSubdomainFromUrl } from './companyService';
import { toast } from 'sonner';

export const useCompanyState = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubdomainMode, setIsSubdomainMode] = useState<boolean>(false);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching company data...');

      // Check for subdomain mode
      const subdomain = detectSubdomainFromUrl();
      
      // If we're in subdomain mode, fetch the company by subdomain
      if (subdomain) {
        setIsSubdomainMode(true);
        
        try {
          const companyData = await fetchCompanyBySubdomain(subdomain);
          if (companyData) {
            setCompany(companyData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error in subdomain lookup:', err);
        }
      }
      
      // Get session to check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        setLoading(false);
        
        // If on a specific page that needs company data like /join, keep the loading state
        if (window.location.pathname.startsWith('/join')) {
          const companyIdParam = new URLSearchParams(window.location.search).get('companyId');
          if (companyIdParam) {
            await fetchCompanyById(companyIdParam)
              .then(companyData => {
                if (companyData) setCompany(companyData);
              })
              .catch(err => setError(err instanceof Error ? err : new Error(String(err))));
          }
        }
        return;
      }
      
      console.log('Getting user profile for ID:', session.user.id);
      
      try {
        // Get user profile to find company ID
        const profile = await getUserProfile(session.user.id);
        
        if (!profile?.company_id) {
          console.log('No company ID found in user profile');
          setLoading(false);
          return;
        }
        
        const companyId = profile.company_id;
        console.log('Found company ID in profile:', companyId);
        
        const companyData = await fetchCompanyById(companyId);
        if (companyData) {
          setCompany(companyData);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error('Failed to load company data');
      } finally {
        setLoading(false);
      }
    } catch (fetchError) {
      console.error('Error in company context:', fetchError);
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)));
      toast.error('Failed to load company data');
      setLoading(false);
    }
  };

  return {
    company,
    loading,
    error,
    isSubdomainMode,
    refreshCompany: fetchCompanyData,
    setCompany
  };
};
