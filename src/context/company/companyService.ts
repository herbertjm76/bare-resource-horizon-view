
import { supabase } from '@/integrations/supabase/client';
import { Company } from './types';
import { toast } from 'sonner';

export const fetchCompanyById = async (companyId: string): Promise<Company | null> => {
  try {
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
      return companyData;
    }
    
    console.error('No company found with ID:', companyId);
    return null;
  } catch (err) {
    console.error('Error fetching company by ID:', err);
    throw err;
  }
};

export const fetchCompanyBySubdomain = async (subdomain: string): Promise<Company | null> => {
  try {
    const { data: companyData, error: subdomainError } = await supabase
      .from('companies')
      .select('*')
      .eq('subdomain', subdomain)
      .maybeSingle();
      
    if (subdomainError) {
      console.error('Error fetching company by subdomain:', subdomainError);
      throw subdomainError;
    }
    
    if (companyData) {
      console.log('Found company by subdomain:', companyData.name);
      return companyData;
    }
    
    console.error('No company found for subdomain:', subdomain);
    return null;
  } catch (err) {
    console.error('Error in subdomain lookup:', err);
    throw err;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Try to create profile as fallback
      const { error } = await createUserProfile(userId);
      if (error) throw error;
      return null;
    }
    
    return profile;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

export const createUserProfile = async (userId: string) => {
  const { data: session } = await supabase.auth.getSession();
  const email = session?.session?.user?.email || '';
  
  const { error } = await supabase.from('profiles')
    .insert({ id: userId, email })
    .select();
  
  if (error) console.error('Error creating profile:', error);
  return { error };
};

export const detectSubdomainFromUrl = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isDevelopmentDomain = hostname.includes('lovable.app');
  
  if (!isLocalhost && isDevelopmentDomain) {
    // Extract subdomain from hostname (e.g., company.lovable.app)
    const subdomain = hostname.split('.')[0];
    console.log('Detected subdomain:', subdomain);
    return subdomain || null;
  }
  
  return null;
};
