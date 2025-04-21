
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
      !company.name || !company.subdomain || !company.address || !company.country || !company.city || !company.size
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
          website: company.website,
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

      // Manually create profile if the trigger didn't work
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user?.id,
          email: ownerEmail,
          first_name: firstName,
          last_name: lastName,
          company_id: companyData.id,
          role: 'owner'
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      } else {
        console.log("Profile created manually as fallback");
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
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white mb-2">Owner Information</h3>
        <div className="grid grid-cols-1 gap-4 bg-white/10 rounded-xl px-6 py-4 glass">
          <div>
            <label htmlFor="ownerName" className="block text-white font-medium mb-1">Full Name</label>
            <Input
              type="text"
              id="ownerName"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="ownerEmail2" className="block text-white font-medium mb-1">Email</label>
            <Input
              type="email"
              id="ownerEmail2"
              value={ownerEmail}
              onChange={e => setOwnerEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="ownerPassword2" className="block text-white font-medium mb-1">Password</label>
            <Input
              type="password"
              id="ownerPassword2"
              value={ownerPassword}
              onChange={e => setOwnerPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
              required
              autoComplete="new-password"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white mb-2">Company Information</h3>
        <div className="space-y-4 bg-white/10 rounded-xl px-6 py-4 glass">
          <div>
            <label htmlFor="companyName" className="block text-white font-medium mb-1">Name</label>
            <Input
              type="text"
              id="companyName"
              value={company.name}
              onChange={e => handleCompanyChange('name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
              required
            />
          </div>
          <div>
            <label htmlFor="companySubdomain" className="block text-white font-medium mb-1">Subdomain</label>
            <div className="flex items-center">
              <Input
                type="text"
                id="companySubdomain"
                value={company.subdomain}
                onChange={e => handleCompanyChange('subdomain', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
                required
              />
              <span className="ml-2 text-gray-300">.bareresource.com</span>
            </div>
            {subdomainCheck.isChecking && (
              <p className="text-blue-400 text-sm mt-1">Checking availability...</p>
            )}
            {subdomainCheck.error && (
              <p className="text-red-400 text-sm mt-1">{subdomainCheck.error}</p>
            )}
          </div>
          <div>
            <label htmlFor="website" className="block text-white font-medium mb-1">
              Website <span className="text-xs text-white/50">(optional)</span>
            </label>
            <Input
              id="website"
              type="url"
              value={company.website || ''}
              onChange={e => handleCompanyChange('website', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
              placeholder="https://yourcompany.com"
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-white font-medium mb-1">Address</label>
            <AddressAutocomplete
              value={company.address}
              country={company.country}
              onChange={(address) => handleCompanyChange('address', address)}
              onSelectSuggestion={(address, city) => {
                handleCompanyChange('address', address);
                if (city) handleCompanyChange('city', city);
              }}
              placeholder="Enter company address"
              disabled={false}
              className="w-full rounded-lg bg-white/20 border border-white/30 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyCity" className="block text-white font-medium mb-1">City</label>
              <Input
                type="text"
                id="companyCity"
                value={company.city}
                onChange={e => handleCompanyChange('city', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
                required
              />
            </div>
            <div>
              <CountryField
                watch={watch}
                setValue={(field, value) => {
                  setValue(field as any, value);
                  handleCompanyChange(field as keyof typeof company, value);
                }}
                errors={errors}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="companySize" className="block text-white font-medium mb-1">Size</label>
              <select
                id="companySize"
                value={company.size}
                onChange={e => handleCompanyChange('size', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
                required
              >
                <option value="">Select size...</option>
                <option value="1-5">1-5</option>
                <option value="5-25">5-25</option>
                <option value="26-50">26-50</option>
                <option value="51-100">51-100</option>
              </select>
            </div>
            <div>
              <label htmlFor="companyIndustry" className="block text-white font-medium mb-1">Industry</label>
              <select
                id="companyIndustry"
                value={company.industry || ""}
                onChange={e => handleCompanyChange('industry', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
                required
              >
                <option value="">Select industry...</option>
                {industryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
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
