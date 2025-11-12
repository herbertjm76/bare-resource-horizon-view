
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
      Company Identifier (URL Slug)
    </label>
    <div className="mt-1 space-y-2">
      <Input
        id="subdomain"
        type="text"
        {...register('subdomain', {
          required: 'Company identifier is required',
          pattern: {
            value: /^[a-zA-Z0-9-]+$/,
            message: 'Can only contain letters, numbers, and hyphens'
          },
          minLength: {
            value: 3,
            message: 'Must be at least 3 characters long'
          },
          maxLength: {
            value: 63,
            message: 'Must be less than 64 characters long'
          }
        })}
        placeholder="yourcompany"
      />
      <p className="text-xs text-gray-400">
        Your company URL will be: bareresource.com/<span className="font-medium">yourcompany</span>
      </p>
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
