
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyFormData, emptyCompany } from '../companyHelpers';
import { Database } from '@/integrations/supabase/types';

// Define the specific user role type to match Supabase's enum
type UserRole = Database['public']['Enums']['user_role'];

export interface SubdomainCheckState {
  isChecking: boolean;
  error: string;
}

export interface SignupFormState {
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPassword: string;
  company: CompanyFormData;
  loading: boolean;
  showConfirmationInfo: boolean;
  signupError: string | null;
  subdomainCheck: SubdomainCheckState;
}

export const useSignupForm = (
  onSwitchToLogin: () => void, 
  ensureProfile: (userId: string, userData?: any) => Promise<boolean>
) => {
  const [formState, setFormState] = useState<SignupFormState>({
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPassword: '',
    company: emptyCompany,
    loading: false,
    showConfirmationInfo: false,
    signupError: null,
    subdomainCheck: { isChecking: false, error: '' },
  });

  const updateFormState = (updates: Partial<SignupFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleOwnerChange = (field: keyof Pick<SignupFormState, 'ownerFirstName' | 'ownerLastName' | 'ownerEmail' | 'ownerPassword'>, value: string) => {
    updateFormState({ [field]: value } as any);
  };

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    updateFormState({ 
      company: { ...formState.company, [field]: value } 
    });
  };

  const checkSubdomainAvailability = async (subdomain: string): Promise<boolean> => {
    updateFormState({ subdomainCheck: { isChecking: true, error: '' } });
    try {
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('subdomain', subdomain.toLowerCase());
      
      if (error) throw error;
      
      const isAvailable = count === 0;
      updateFormState({ subdomainCheck: { isChecking: false, error: '' } });
      
      if (!isAvailable) {
        updateFormState({ 
          subdomainCheck: { isChecking: false, error: 'This subdomain is already taken. Please choose another one.' } 
        });
      }
      
      return isAvailable;
    } catch (error: any) {
      console.error('Error checking subdomain availability:', error);
      updateFormState({ 
        subdomainCheck: { isChecking: false, error: 'Could not check subdomain. Please try again.' } 
      });
      return false;
    }
  };

  const validateForm = (): boolean => {
    const { ownerFirstName, ownerLastName, ownerEmail, ownerPassword, company } = formState;
    
    if (!ownerFirstName || !ownerLastName || !ownerEmail || !ownerPassword) {
      updateFormState({ signupError: 'Please fill in all required owner fields.' });
      toast.error('Please fill in all required owner fields.');
      return false;
    }
    
    if (!company.name || !company.subdomain) {
      updateFormState({ signupError: 'Company name and subdomain are required.' });
      toast.error('Company name and subdomain are required.');
      return false;
    }

    // Check password strength
    if (ownerPassword.length < 6) {
      updateFormState({ signupError: 'Password must be at least 6 characters long' });
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    updateFormState({ loading: true, signupError: null });
    
    try {
      if (!validateForm()) {
        updateFormState({ loading: false });
        return;
      }

      const { company, ownerEmail, ownerPassword, ownerFirstName, ownerLastName } = formState;

      // Check subdomain availability
      const available = await checkSubdomainAvailability(company.subdomain);
      if (!available) {
        updateFormState({ 
          signupError: 'This subdomain is already taken. Please choose another one.',
          loading: false 
        });
        toast.error('This subdomain is already taken. Please choose another one.');
        return;
      }
      
      console.log('Creating company with data:', {
        name: company.name,
        subdomain: company.subdomain.toLowerCase(),
        website: company.website || null,
      });
      
      // 1. Create company first 
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          subdomain: company.subdomain.toLowerCase(),
          website: company.website || null,
          // Only include these if they're provided
          ...(company.address ? { address: company.address } : {}),
          ...(company.city ? { city: company.city } : {}),
          ...(company.country ? { country: company.country } : {}),
          ...(company.size ? { size: company.size } : {}),
          ...(company.industry ? { industry: company.industry } : {})
        })
        .select()
        .single();

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw companyError;
      }

      console.log('Company created successfully with ID:', companyData.id);

      // Define the role explicitly as a valid UserRole enum value
      const userRole: UserRole = 'owner';

      // 2. Sign up user with Supabase Auth
      console.log('Signing up user with email:', ownerEmail);
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            first_name: ownerFirstName,
            last_name: ownerLastName,
            company_id: companyData.id,
            role: userRole
          },
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (signUpError) {
        // If auth fails, clean up by deleting the company
        console.error('Signup error:', signUpError);
        await supabase.from('companies').delete().eq('id', companyData.id);
        throw signUpError;
      }

      if (!authData.user) {
        console.error('No user returned from signup');
        await supabase.from('companies').delete().eq('id', companyData.id);
        throw new Error('Failed to create user account');
      }

      console.log('Auth signup successful, user created:', authData.user.id);
      
      // Manually ensure profile exists through our reliable function
      try {
        console.log('Ensuring profile exists...');
        const profileCreated = await ensureProfile(authData.user.id, {
          email: ownerEmail,
          firstName: ownerFirstName,
          lastName: ownerLastName,
          companyId: companyData.id,
          role: userRole
        });
        
        if (profileCreated) {
          console.log('Profile creation successful');
        } else {
          console.warn('Profile creation may have failed - check for duplicates');
        }
      } catch (profileErr) {
        console.warn('Error in manual profile creation:', profileErr);
        // Don't fail the signup if this fails
      }

      // Show success message and confirmation info
      toast.success('Sign up successful! Please check your email to confirm your account.');
      updateFormState({
        showConfirmationInfo: true,
        ownerFirstName: '',
        ownerLastName: '',
        ownerEmail: '',
        ownerPassword: '',
        company: emptyCompany,
        loading: false
      });
      
    } catch (error: any) {
      console.error("Signup error:", error);
      updateFormState({ 
        signupError: error.message || 'Sign up failed. Please try again.',
        loading: false
      });
      toast.error(error.message || 'Sign up failed. Please try again.');
    }
  };

  return {
    formState,
    handleOwnerChange,
    handleCompanyChange,
    handleSignUp,
    checkSubdomainAvailability,
  };
};
