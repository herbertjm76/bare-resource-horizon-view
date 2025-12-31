
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import OwnerInfoFields from "./OwnerInfoFields";
import CompanyInfoFields from "./CompanyInfoFields";
import { emptyCompany, CompanyFormData } from '../companyHelpers';
import { logger } from '@/utils/logger';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  // Owner fields matched to profile table
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [company, setCompany] = useState<CompanyFormData>(emptyCompany);
  const [subdomainCheck, setSubdomainCheck] = useState({ isChecking: false, error: '' });
  const [loading, setLoading] = useState(false);
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

  // Generate a random 4-digit suffix for security
  const generateSubdomain = (name: string): string => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return slug ? `${slug}-${randomSuffix}` : '';
  };

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    if (field === 'name') {
      // Auto-generate subdomain when company name changes
      const subdomain = generateSubdomain(value);
      setCompany((prev) => ({ ...prev, name: value, subdomain }));
    } else {
      setCompany((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure no active session so RLS treats this as anon for company creation
    await supabase.auth.signOut();
    if (
      !ownerFirstName || !ownerLastName || !ownerEmail || !ownerPassword ||
      !company.name || !company.subdomain || !company.address || !company.country || !company.city || !company.size || !company.industry
    ) {
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const available = await checkSubdomainAvailability(company.subdomain);
    if (!available) {
      toast.error('This subdomain is already taken. Please choose another one.');
      setLoading(false);
      return;
    }

    try {
      // 1) Create company FIRST (as anon user, before signup)
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          subdomain: company.subdomain.toLowerCase(),
          website: company.website || null,
          address: company.address,
          size: company.size,
          city: company.city,
          country: company.country,
          industry: company.industry
        })
        .select()
        .single();

      if (companyError) throw companyError;

      logger.info('Company created:', companyData.id);

      // 2) Sign up the user with company reference in metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            first_name: ownerFirstName,
            last_name: ownerLastName,
            company_id: companyData.id,
            role: 'owner'
          },
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (signUpError) {
        // Clean up company if signup fails
        await supabase.from('companies').delete().eq('id', companyData.id);
        throw signUpError;
      }

      logger.info('User signed up:', signUpData.user?.id);

      // 3) The trigger will create the profile, but we'll ensure it's linked
      if (signUpData.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            email: ownerEmail,
            first_name: ownerFirstName,
            last_name: ownerLastName,
            company_id: companyData.id,
            role: 'owner'
          }, { onConflict: 'id' });
      }

      toast.success(`Account created! Your company portal: bareresource.com/${company.subdomain}. Check your email to verify your account.`, { duration: 8000 });
      setOwnerFirstName('');
      setOwnerLastName('');
      setOwnerEmail('');
      setOwnerPassword('');
      setCompany(emptyCompany);
      onSwitchToLogin();
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp} autoComplete="off">
      <h2 className="text-2xl font-extrabold text-white mb-1 text-center">Sign Up & Register Company</h2>
      <p className="text-white/70 text-center mb-6">Complete your details to create your account and register your company in one step.</p>

      <OwnerInfoFields
        ownerFirstName={ownerFirstName}
        setOwnerFirstName={setOwnerFirstName}
        ownerLastName={ownerLastName}
        setOwnerLastName={setOwnerLastName}
        ownerEmail={ownerEmail}
        setOwnerEmail={setOwnerEmail}
        ownerPassword={ownerPassword}
        setOwnerPassword={setOwnerPassword}
      />

      <CompanyInfoFields
        company={company}
        handleCompanyChange={handleCompanyChange}
        subdomainCheck={subdomainCheck}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-4"
        isLoading={loading}
      >
        Sign Up & Register Company
      </Button>
    </form>
  );
};

export default SignupForm;
