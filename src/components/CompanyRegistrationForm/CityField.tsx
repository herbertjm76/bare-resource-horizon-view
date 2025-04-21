
import React from "react";
import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface CityFieldProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  watch?: UseFormWatch<CompanyFormData>;
  setValue?: UseFormSetValue<CompanyFormData>;
}

const CityField: React.FC<CityFieldProps> = ({ register, errors, watch, setValue }) => {
  return (
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-200">
        City
      </label>
      <Input
        id="city"
        type="text"
        {...register('city', { required: "City is required" })}
        className="mt-1"
      />
      {errors.city && (
        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
      )}
    </div>
  );
};

export default CityField;
