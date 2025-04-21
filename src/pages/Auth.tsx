
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import CountryField from '@/components/CompanyRegistrationForm/CountryField';
import AddressField from '@/components/CompanyRegistrationForm/AddressField';
import CityField from '@/components/CompanyRegistrationForm/CityField';
import SizeField from '@/components/CompanyRegistrationForm/SizeField';
import SubdomainField from '@/components/CompanyRegistrationForm/SubdomainField';
import WebsiteField from '@/components/CompanyRegistrationForm/WebsiteField';

type CompanyFormData = {
  name: string;
  subdomain: string;
  address: string;
  country: string;
  city: string;
  size: string;
  website?: string;
};

const emptyCompany: CompanyFormData = {
  name: '',
  subdomain: '',
  address: '',
  country: '',
  city: '',
  size: '',
  website: ''
};

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Owner/cred fields
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Company fields
  const [company, setCompany] = useState<CompanyFormData>(emptyCompany);
  const [subdomainCheck, setSubdomainCheck] = useState({ isChecking: false, error: '' });

  const navigate = useNavigate();

  // Set up form validation using react-hook-form
  const form = useForm<CompanyFormData>({
    defaultValues: emptyCompany
  });
  
  const { register, watch, setValue, formState: { errors } } = form;

  // Auto-redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  // Update form values when company state changes
  useEffect(() => {
    Object.entries(company).forEach(([key, value]) => {
      setValue(key as keyof CompanyFormData, value);
    });
  }, [company, setValue]);

  // Utility to check for subdomain availability
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
    } catch(e: any) {
      setSubdomainCheck({ isChecking: false, error: 'Could not check subdomain.' });
      return false;
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: ownerEmail,
        password: ownerPassword,
      });
      if (error) throw error;
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle consolidated signup + company registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple frontend validations
    if (!ownerName || !ownerEmail || !ownerPassword ||
        !company.name || !company.subdomain || !company.address || !company.country || !company.city || !company.size) {
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Check subdomain availability before proceeding
    const available = await checkSubdomainAvailability(company.subdomain);
    if (!available) {
      toast.error('This subdomain is already taken. Please choose another one.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create user with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: { name: ownerName }
        }
      });
      if (signUpError) throw signUpError;
      // Get the new user ID
      const user = signUpData?.user;
      if (!user || !user.id) {
        throw new Error('Could not create user');
      }

      // 2. Register the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          subdomain: company.subdomain.toLowerCase(),
          website: company.website,
          address: company.address,
          size: company.size,
          city: company.city,
          country: company.country
        })
        .select()
        .single();
      if (companyError) throw companyError;

      // 3. Update user profile: set company_id and role to owner
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: companyData.id,
          role: 'owner'
        })
        .eq('id', user.id);
      if (profileError) throw profileError;

      toast.success('Sign up and company registration successful! You may now log in.');
      setIsLogin(true);
      setOwnerEmail('');
      setOwnerPassword('');
      setOwnerName('');
      setCompany(emptyCompany);
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Change handler for companies fields
  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          BareResource Pro
        </h1>
        {isLogin ? (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Login</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ownerEmail" className="block text-white font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    id="ownerEmail"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ownerPassword" className="block text-white font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    id="ownerPassword"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
              isLoading={loading}
            >
              Log In
            </Button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSignUp} autoComplete="off">
            <h2 className="text-xl font-semibold text-white mb-2">Sign Up & Register Company</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">Owner Information</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="ownerName" className="block text-white font-medium mb-1">Your Name</label>
                    <Input
                      type="text"
                      id="ownerName"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ownerEmail2" className="block text-white font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      id="ownerEmail2"
                      value={ownerEmail}
                      onChange={e => setOwnerEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ownerPassword2" className="block text-white font-medium mb-1">Password</label>
                    <Input
                      type="password"
                      id="ownerPassword2"
                      value={ownerPassword}
                      onChange={e => setOwnerPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="companyName" className="block text-white font-medium mb-1">Company Name</label>
                    <Input
                      type="text"
                      id="companyName"
                      value={company.name}
                      onChange={e => handleCompanyChange('name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
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
                        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
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
                    <label htmlFor="companyCountry" className="block text-white font-medium mb-1">Country</label>
                    <CountryField
                      watch={watch}
                      setValue={(field, value) => {
                        setValue(field as any, value);
                        handleCompanyChange(field as keyof CompanyFormData, value);
                      }}
                      errors={errors}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyAddress" className="block text-white font-medium mb-1">Company Address</label>
                    <AddressField
                      watch={watch}
                      setValue={(field, value) => {
                        setValue(field as any, value);
                        handleCompanyChange(field as keyof CompanyFormData, value);
                      }}
                      errors={errors}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyCity" className="block text-white font-medium mb-1">City</label>
                    <Input
                      type="text"
                      id="companyCity"
                      value={company.city}
                      onChange={e => handleCompanyChange('city', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companySize" className="block text-white font-medium mb-1">Company Size</label>
                    <select
                      id="companySize"
                      value={company.size}
                      onChange={e => handleCompanyChange('size', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
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
                    <label htmlFor="website" className="block text-white font-medium mb-1">Website (optional)</label>
                    <Input
                      id="website"
                      type="url"
                      value={company.website || ''}
                      onChange={e => handleCompanyChange('website', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
              isLoading={loading}
            >
              Sign Up & Register Company
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          {isLogin ? (
            <span className="text-white/80 text-sm">
              Don&apos;t have an account?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setIsLogin(false); setOwnerName(''); setOwnerEmail(''); setOwnerPassword(''); setCompany(emptyCompany); }}
                className="underline text-white font-medium hover:text-pink-200 focus:outline-none bg-transparent border-none p-0 m-0"
                tabIndex={0}
              >
                Sign up
              </a>
            </span>
          ) : (
            <span className="text-white/80 text-sm">
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setIsLogin(true); setOwnerName(''); setOwnerEmail(''); setOwnerPassword(''); setCompany(emptyCompany); }}
                className="underline text-white font-medium hover:text-blue-200 focus:outline-none bg-transparent border-none p-0 m-0"
                tabIndex={0}
              >
                Log in
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
