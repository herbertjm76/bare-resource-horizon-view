
import React from "react";
import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface SubdomainFieldProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  isChecking: boolean;
}

const SubdomainField: React.FC<SubdomainFieldProps> = ({ register, errors, isChecking }) => (
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
    {isChecking && (
      <p className="text-blue-400 text-sm mt-1">Checking availability...</p>
    )}
  </div>
);

export default SubdomainField;
