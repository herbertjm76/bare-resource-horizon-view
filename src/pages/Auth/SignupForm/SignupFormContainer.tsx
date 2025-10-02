
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompanyInfoFields from "./CompanyInfoFields";
import { emptyCompany, CompanyFormData } from '../companyHelpers';
import { ensureUserProfile } from '@/utils/authHelpers';
import { Database } from '@/integrations/supabase/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Define the specific user role type to match Supabase's enum
type UserRole = Database['public']['Enums']['user_role'];

interface SignupFormContainerProps {
  onSwitchToLogin: () => void;
}

const SignupFormContainer: React.FC<SignupFormContainerProps> = ({ onSwitchToLogin }) => {
  // Simplified owner fields - only essential info
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [company, setCompany] = useState<CompanyFormData>(emptyCompany);
  const [subdomainCheck, setSubdomainCheck] = useState({ isChecking: false, error: '' });
  const [loading, setLoading] = useState(false);
  const [showConfirmationInfo, setShowConfirmationInfo] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<CompanyFormData>({ defaultValues: emptyCompany });
  const { watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    Object.entries(company).forEach(([key, value]) => {
      setValue(key as keyof CompanyFormData, value);
    });
  }, [company, setValue]);

  const checkSubdomainAvailability = async (subdomain: string) => {
    setSubdomainCheck({ isChecking: true, error: '' });
    try {
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('subdomain', subdomain.toLowerCase());
      if (error) throw error;
      setSubdomainCheck({ isChecking: false, error: '' });
      return count === 0;
    } catch {
      setSubdomainCheck({ isChecking: false, error: 'Could not check subdomain.' });
      return false;
    }
  };

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSignupError(null);
    
    try {
      // Validate required fields - simplified to essentials only
      if (
        !ownerEmail || !ownerPassword ||
        !company.name || !company.subdomain
      ) {
        setSignupError('Please fill in all required fields.');
        toast.error('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Check password strength
      if (ownerPassword.length < 6) {
        setSignupError('Password must be at least 6 characters long');
        toast.error('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Check subdomain availability
      const available = await checkSubdomainAvailability(company.subdomain);
      if (!available) {
        setSignupError('This subdomain is already taken. Please choose another one.');
        toast.error('This subdomain is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      console.log('Starting signup process with data:', {
        email: ownerEmail,
        company: {
          name: company.name,
          subdomain: company.subdomain
        }
      });
      
      // 1. Create company first - only essential fields
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          subdomain: company.subdomain.toLowerCase(),
          website: company.website || null,
          // Optional fields set to null/default - can be filled in later
          address: company.address || null,
          size: company.size || null,
          city: company.city || null,
          country: company.country || null,
          industry: company.industry || null
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

      // 2. Sign up user with Supabase Auth - simplified metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
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

      console.log('User created successfully with ID:', authData.user.id);

      // 3. Create profile record manually since the trigger might be failing
      const profileCreated = await ensureUserProfile(authData.user.id, {
        email: ownerEmail,
        companyId: companyData.id,
        role: userRole
      });

      if (!profileCreated) {
        console.warn('Warning: Could not ensure profile creation through helper function');
        // We'll continue anyway since the database trigger should handle this
      }

      // Show success message and confirmation info
      toast.success('Sign up successful! Please check your email to confirm your account.');
      setShowConfirmationInfo(true);
      
      // Clear form
      setOwnerEmail('');
      setOwnerPassword('');
      setCompany(emptyCompany);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      setSignupError(error.message || 'Sign up failed. Please try again.');
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp} autoComplete="off">
      <h2 className="text-2xl font-extrabold text-white mb-1 text-center">Sign Up & Register Company</h2>
      <p className="text-white/70 text-center mb-6">Get started in seconds - just email, password, and company name.</p>

      {signupError && (
        <Alert className="bg-red-500/10 border border-red-500/30 mb-4 text-white">
          <InfoIcon className="h-4 w-4 text-red-300" />
          <AlertDescription className="text-white/90">
            {signupError}
          </AlertDescription>
        </Alert>
      )}

      {showConfirmationInfo && (
        <Alert className="bg-blue-500/10 border border-blue-500/30 mb-4 text-white">
          <InfoIcon className="h-4 w-4 text-blue-300" />
          <AlertDescription className="text-white/90">
            <p className="font-medium">Please check your email to confirm your account</p>
            <p className="mt-1">You'll need to click the confirmation link in your email before you can log in.</p>
            <Button 
              variant="link" 
              className="text-blue-300 p-0 h-auto mt-2" 
              onClick={() => onSwitchToLogin()}
            >
              Go to login page
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Simplified owner fields - just email and password */}
      <div className="space-y-4">
        <div>
          <label htmlFor="ownerEmail" className="block text-white font-medium mb-1">Email</label>
          <Input
            type="email"
            id="ownerEmail"
            value={ownerEmail}
            onChange={e => setOwnerEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
            required
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="ownerPassword" className="block text-white font-medium mb-1">Password</label>
          <Input
            type="password"
            id="ownerPassword"
            value={ownerPassword}
            onChange={e => setOwnerPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
            required
            placeholder="Min. 6 characters"
          />
        </div>
      </div>

      <CompanyInfoFields
        company={company}
        handleCompanyChange={handleCompanyChange}
        subdomainCheck={subdomainCheck}
      />

      <Button
        type="submit"
        disabled={loading || showConfirmationInfo}
        className="w-full mt-4"
        isLoading={loading}
      >
        Sign Up & Register Company
      </Button>
      
      {showConfirmationInfo && (
        <p className="text-center text-white/70 text-sm mt-2">
          You need to confirm your email before logging in
        </p>
      )}
    </form>
  );
};

export default SignupFormContainer;
