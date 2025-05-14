
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

const companySizes = [
  { value: "1-5", label: "1-5" },
  { value: "5-25", label: "5-25" },
  { value: "26-50", label: "26-50" },
  { value: "51-100", label: "51-100" },
];

interface SizeFieldProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const SizeField: React.FC<SizeFieldProps> = ({ register, errors }) => (
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
);

export default SizeField;
