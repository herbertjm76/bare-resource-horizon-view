import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CountryField from '@/components/CompanyRegistrationForm/CountryField';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';
import { useForm } from "react-hook-form";
import { emptyCompany, CompanyFormData, industryOptions } from './companyHelpers';
import OwnerInfoFields from "./SignupForm/OwnerInfoFields";
import CompanyInfoFields from "./SignupForm/CompanyInfoFields";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [company, setCompany] = useState<CompanyFormData>(emptyCompany);
  const [subdomainCheck, setSubdomainCheck] = useState({ isChecking: false, error: '' });
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
      !ownerName || !ownerEmail || !ownerPassword ||
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
      // Extract first and last name
      const nameParts = ownerName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      console.log("Creating company with data:", company);
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
      console.log("Company created:", companyData);

      console.log("Signing up user with metadata:", {
        first_name: firstName,
        last_name: lastName,
        company_id: companyData.id,
        role: 'owner'
      });

      // First create the auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_id: companyData.id,
            role: 'owner'
          }
        }
      });

      if (signUpError) throw signUpError;
      console.log("User signed up successfully:", signUpData);

      // Ensure profile is created immediately with all needed data
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email: ownerEmail,
            first_name: firstName,
            last_name: lastName,
            company_id: companyData.id,
            role: 'owner'
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Retry with upsert to handle potential race conditions
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              email: ownerEmail,
              first_name: firstName,
              last_name: lastName,
              company_id: companyData.id,
              role: 'owner'
            });
          
          if (upsertError) {
            console.error("Error even with upsert:", upsertError);
          } else {
            console.log("Profile created with upsert as fallback");
          }
        } else {
          console.log("Profile created directly");
        }
      }

      toast.success('Sign up successful! Please check your email to confirm your account, then you can log in.');
      setOwnerEmail(''); setOwnerPassword(''); setOwnerName(''); setCompany(emptyCompany);
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
        ownerName={ownerName}
        setOwnerName={setOwnerName}
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
