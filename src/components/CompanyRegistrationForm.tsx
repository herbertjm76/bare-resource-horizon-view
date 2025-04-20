
import React from 'react';
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
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CompanyFormData>();

  const onSubmit = async (data: CompanyFormData) => {
    try {
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
              }
            })}
          />
          <span className="ml-2 text-gray-300">.bareresource.com</span>
        </div>
        {errors.subdomain && (
          <p className="text-red-500 text-sm mt-1">{errors.subdomain.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-200">
          Website (optional)
        </label>
        <Input
          id="website"
          type="url"
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
