
import React from "react";
import { Input } from "@/components/ui/input";
import CountryField from "@/components/CompanyRegistrationForm/CountryField";
import { CompanyFormData } from "../../companyHelpers";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";

interface CompanyCityCountryFieldsProps {
  city: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  watch: UseFormWatch<CompanyFormData>;
  setValue: (field: keyof CompanyFormData, value: string) => void;
  errors: any;
}

const CompanyCityCountryFields: React.FC<CompanyCityCountryFieldsProps> = ({ 
  city, 
  onChange, 
  watch, 
  setValue, 
  errors 
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="companyCity" className="block text-white font-medium mb-1">City</label>
      <Input
        type="text"
        id="companyCity"
        value={city}
        onChange={e => onChange('city', e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
        required
      />
    </div>
    <div>
      <CountryField
        watch={watch}
        setValue={(field, value) => {
          setValue(field as any, value);
          onChange(field as keyof CompanyFormData, value);
        }}
        errors={errors}
      />
    </div>
  </div>
);

export default CompanyCityCountryFields;
