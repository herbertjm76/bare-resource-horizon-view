
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import OwnerInfoFields from "./SignupForm/OwnerInfoFields";
import CompanyInfoFields from "./SignupForm/CompanyInfoFields";
import { emptyCompany, CompanyFormData } from './companyHelpers';

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

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      // Create company first
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

      // Now sign up user with profile metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            first_name: ownerFirstName,
            last_name: ownerLastName,
            company_id: companyData.id,
            role: 'owner'
          }
        }
      });

      if (signUpError) throw signUpError;

      // Ensure profile is created for this user (manual fallback)
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email: ownerEmail,
            first_name: ownerFirstName,
            last_name: ownerLastName,
            company_id: companyData.id,
            role: 'owner'
          });

        if (profileError) {
          // Fallback to upsert to handle rare race condition
          await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              email: ownerEmail,
              first_name: ownerFirstName,
              last_name: ownerLastName,
              company_id: companyData.id,
              role: 'owner'
            });
        }
      }

      toast.success('Sign up successful! Please check your email to confirm your account, then you can log in.');
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
        watch={watch}
        setValue={setValue}
        errors={errors}
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
