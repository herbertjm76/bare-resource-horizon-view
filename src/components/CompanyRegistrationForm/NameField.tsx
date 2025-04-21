
import React from "react";
import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface NameFieldProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const NameField: React.FC<NameFieldProps> = ({ register, errors }) => (
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
);

export default NameField;
