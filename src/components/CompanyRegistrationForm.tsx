
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CountrySelect } from "@/components/ui/CountrySelect";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface CompanyFormData {
  name: string;
  subdomain: string;
  website?: string;
  address: string;
  country: string;
  size: string;
  city: string;  // <-- added city
}

interface CompanyRegistrationFormProps {
  onSuccess: (companyId: string) => void;
  userId: string;
}

const companySizes = [
  { value: "1-5", label: "1-5" },
  { value: "5-25", label: "5-25" },
  { value: "26-50", label: "26-50" },
  { value: "51-100", label: "51-100" },
];

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

  // Country and Address Management
  const selectedCountry = watch("country");
  const addressValue = watch("address");
  const cityValue = watch("city");

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
          address: data.address,
          size: data.size,
          // Note: If you want to also save city, add `city: data.city` to your DB/company table
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
      {/* Name */}
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

      {/* Subdomain */}
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

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-200">
          Country
        </label>
        <CountrySelect
          value={selectedCountry ?? ""}
          onChange={(_name, code) => setValue("country", _name)}
          placeholder="Select country"
        />
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      {/* Address (under country, with autocomplete) */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-200">
          Company Address
        </label>
        <AddressAutocomplete
          value={addressValue || ""}
          country={selectedCountry || ""}
          onChange={addr => setValue("address", addr)}
          disabled={!selectedCountry}
          placeholder={selectedCountry ? "Type address..." : "Select country above first"}
          // when a suggestion is selected, auto-update city
          onSelectSuggestion={(addr, city) => {
            setValue('address', addr);
            if (city) setValue('city', city);
          }}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* City (auto filled, still editable) */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-200">
          City
        </label>
        <Input
          id="city"
          type="text"
          {...register('city', { required: "City is required" })}
          className="mt-1"
          value={cityValue || ""}
          onChange={(e) => setValue('city', e.target.value)}
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* Company Size dropdown */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-200">
          Company Size
        </label>
        <select
          id="size"
          {...register('size', { required: "Size is required" })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Select size...</option>
          {companySizes.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.size && (
          <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
        )}
      </div>

      {/* Website */}
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

      <Button type="submit" className="w-full">
        Register Company
      </Button>
    </form>
  );
};
