
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CompanyFormData {
  name: string;
  subdomain: string;
  website?: string;
  description?: string;
}

interface CompanyRegistrationFormProps {
  onSuccess: (companyId: string) => void;
  userId: string;
}

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  onSuccess,
  userId,
}) => {
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<CompanyFormData>();
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
      console.error('Error checking subdomain:', error);
      return false;
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Check if subdomain is available
      const isAvailable = await checkSubdomainAvailability(data.subdomain);
      
      if (!isAvailable) {
        setError('subdomain', {
          type: 'manual',
          message: 'This subdomain is already taken. Please choose another one.'
        });
        return;
      }

      // Insert the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          subdomain: data.subdomain.toLowerCase(),
          website: data.website,
          description: data.description,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Update the user's profile with the company ID and owner role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          company_id: company.id,
          role: 'owner'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      toast.success('Company registered successfully!');
      onSuccess(company.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Company Name
        </label>
        <Input
          id="name"
          type="text"
          {...register('name', { required: 'Company name is required' })}
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-200">
          Subdomain
        </label>
        <div className="flex items-center mt-1">
          <Input
            id="subdomain"
            type="text"
            {...register('subdomain', {
              required: 'Subdomain is required',
              pattern: {
                value: /^[a-zA-Z0-9-]+$/,
                message: 'Subdomain can only contain letters, numbers, and hyphens'
              },
              minLength: {
                value: 3,
                message: 'Subdomain must be at least 3 characters long'
              },
              maxLength: {
                value: 63,
                message: 'Subdomain must be less than 64 characters long'
              }
            })}
          />
          <span className="ml-2 text-gray-300">.bareresource.com</span>
        </div>
        {errors.subdomain && (
          <p className="text-red-500 text-sm mt-1">{errors.subdomain.message}</p>
        )}
        {isCheckingSubdomain && (
          <p className="text-blue-400 text-sm mt-1">Checking availability...</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-200">
          Website (optional)
        </label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourcompany.com"
          {...register('website')}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-200">
          Description (optional)
        </label>
        <Input
          id="description"
          type="text"
          placeholder="Brief description of your company"
          {...register('description')}
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Register Company
      </Button>
    </form>
  );
};
