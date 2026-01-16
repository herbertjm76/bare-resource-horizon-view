
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
import { signupSchema } from '@/utils/authValidation';
import { logger } from '@/utils/logger';

// Define the specific user role type to match Supabase's enum
type UserRole = Database['public']['Enums']['user_role'];

interface SignupFormContainerProps {
  onSwitchToLogin: () => void;
}

const SignupFormContainer: React.FC<SignupFormContainerProps> = ({ onSwitchToLogin }) => {
  // Simplified owner fields - only essential info
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const { data: isAvailable, error } = await supabase
        .rpc('check_subdomain_available', { subdomain_param: subdomain.toLowerCase() });
      if (error) throw error;
      setSubdomainCheck({ isChecking: false, error: '' });
      return isAvailable === true;
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
    
    // Ensure no active session so RLS treats this as anon for company creation
    await supabase.auth.signOut();
    
    try {
      // Validate all inputs using zod schema
      const validationResult = signupSchema.safeParse({
        email: ownerEmail,
        password: ownerPassword,
        confirmPassword: confirmPassword,
        firstName: '', // Not collected in signup, will be added later
        lastName: '', // Not collected in signup, will be added later
        companyName: company.name,
        subdomain: company.subdomain,
        website: company.website || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        size: company.size || '',
        industry: company.industry || '',
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        setSignupError(firstError.message);
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      // Use validated data
      const validatedData = validationResult.data;

      // Check subdomain availability
      const available = await checkSubdomainAvailability(validatedData.subdomain);
      if (!available) {
        setSignupError('This subdomain is already taken. Please choose another one.');
        toast.error('This subdomain is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      
      // Define the role explicitly as a valid UserRole enum value
      const userRole: UserRole = 'owner';

      // 1. Create company FIRST (as anon user, before signup - RLS now allows this)
      const companyId = crypto.randomUUID();
      const { error: companyError } = await supabase
        .from('companies')
        .insert({
          id: companyId,
          name: validatedData.companyName,
          subdomain: validatedData.subdomain,
          website: validatedData.website || null,
          address: validatedData.address || null,
          size: validatedData.size || null,
          city: validatedData.city || null,
          country: validatedData.country || null,
          industry: validatedData.industry || null
        });

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw companyError;
      }

      logger.info('Company created successfully with ID:', companyId);

      // 2. Sign up user with company reference in metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            company_id: companyId,
            role: userRole
          },
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        // Clean up company if signup fails
        await supabase.from('companies').delete().eq('id', companyId);
        throw signUpError;
      }

      if (!authData.user) {
        console.error('No user returned from signup');
        await supabase.from('companies').delete().eq('id', companyId);
        throw new Error('Failed to create user account');
      }

      logger.info('User created successfully with ID:', authData.user.id);

      // 3. Ensure profile is linked to company (trigger should do this, but we'll make sure)
      await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: validatedData.email,
          company_id: companyId
        }, { onConflict: 'id' });
      
      // 4. Add role to user_roles table (best-effort; may require confirmed email/session)
      const { error: roleInsertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: userRole,
          company_id: companyId
        });

      if (roleInsertError) {
        logger.warn('[SignupFormContainer] Could not write user_roles during signup (will be set on first login):', roleInsertError);
      }

      // Show success message
      toast.success('Account created! Please check your email to confirm, then you can log in.');
      setShowConfirmationInfo(true);
      
      // Clear form
      setOwnerEmail('');
      setOwnerPassword('');
      setConfirmPassword('');
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
    <form className="space-y-6" onSubmit={handleSignUp} autoComplete="off">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-white/60 text-sm">Get started in seconds</p>
      </div>

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
          <label htmlFor="ownerEmail" className="block text-white/90 font-medium mb-2 text-sm">Email</label>
          <Input
            type="email"
            id="ownerEmail"
            value={ownerEmail}
            onChange={e => setOwnerEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
            required
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="ownerPassword" className="block text-white/90 font-medium mb-2 text-sm">Password</label>
          <Input
            type="password"
            id="ownerPassword"
            value={ownerPassword}
            onChange={e => setOwnerPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
            required
            placeholder="Min. 8 characters with uppercase, lowercase & number"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-white/90 font-medium mb-2 text-sm">Confirm Password</label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
            required
            placeholder="Re-enter your password"
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
        className="w-full mt-6 py-6 text-base font-semibold bg-white text-primary hover:bg-white/90 rounded-xl transition-all shadow-lg hover:shadow-xl"
        isLoading={loading}
      >
        Create Account
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
