
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import NameField from "./CompanyRegistrationForm/NameField";
import SubdomainField from "./CompanyRegistrationForm/SubdomainField";
import CountryField from "./CompanyRegistrationForm/CountryField";
import AddressField from "./CompanyRegistrationForm/AddressField";
import CityField from "./CompanyRegistrationForm/CityField";
import SizeField from "./CompanyRegistrationForm/SizeField";
import WebsiteField from "./CompanyRegistrationForm/WebsiteField";
import { logger } from '@/utils/logger';

export interface CompanyFormData {
  name: string;
  subdomain: string;
  website?: string;
  address: string;
  country: string;
  size: string;
  city: string;
  industry: string; // Added the industry field to match the type in companyHelpers.ts
}

interface CompanyRegistrationFormProps {
  onSuccess: (companyId: string) => void;
  userId: string;
}

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  onSuccess,
  userId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm<CompanyFormData>();
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);

  const checkSubdomainAvailability = async (subdomain: string) => {
    setIsCheckingSubdomain(true);
    try {
      const { data, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .eq('subdomain', subdomain.toLowerCase());

      if (error) throw error;
      return count === 0;
    } catch (error) {
      logger.error('Error checking subdomain:', error);
      return false;
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const isAvailable = await checkSubdomainAvailability(data.subdomain);

      if (!isAvailable) {
        setError('subdomain', {
          type: 'manual',
          message: 'This subdomain is already taken. Please choose another one.'
        });
        return;
      }

      logger.debug("Submitting company with data:", data);

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          subdomain: data.subdomain.toLowerCase(),
          website: data.website,
          address: data.address,
          size: data.size,
          city: data.city,
          industry: data.industry // Add industry to the insert operation
        })
        .select()
        .single();

      if (companyError) throw companyError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: company.id,
          role: 'owner'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      toast.success(`Company registered! Access your portal at: bareresource.com/${data.subdomain}`, { duration: 6000 });
      onSuccess(company.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <NameField register={register} errors={errors} />
      <SubdomainField register={register} errors={errors} isChecking={isCheckingSubdomain} />
      <CountryField watch={watch} setValue={setValue} errors={errors} />
      <AddressField watch={watch} setValue={setValue} errors={errors} />
      <CityField register={register} errors={errors} />
      <SizeField register={register} errors={errors} />
      <WebsiteField register={register} />
      <Button type="submit" className="w-full">
        Register Company
      </Button>
    </form>
  );
};

export default CompanyRegistrationForm;
