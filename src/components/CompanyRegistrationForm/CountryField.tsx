
import React from "react";
import CountrySelect from "@/components/ui/CountrySelect";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface CountryFieldProps {
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const CountryField: React.FC<CountryFieldProps> = ({ watch, setValue, errors }) => {
  const selectedCountry = watch("country");

  return (
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
  );
};

export default CountryField;
